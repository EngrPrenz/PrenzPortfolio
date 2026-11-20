export type Operator =
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan';

export interface RuleCondition {
  attribute: string;
  operator: Operator;
  value: unknown;
}

export interface TargetingRule {
  id: string;
  description?: string;
  conditions: RuleCondition[];
  serve?: boolean;
  rolloutPercentage?: number;
}

export interface FlagConfig {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  rules?: TargetingRule[];
  version?: number;
}

export type EvaluationReason =
  | 'ARCHIVED_OR_MISSING'
  | 'DISABLED'
  | 'RULE_MATCH'
  | 'DEFAULT_ROLLOUT'
  | 'FALLBACK_DEFAULT';

export interface EvaluationResult {
  enabled: boolean;
  reason: EvaluationReason;
  matchedRuleId?: string;
  bucket?: number;
}

export interface UserContext {
  userId?: string;
  [key: string]: unknown;
}

/**
 * 32-bit FNV-1a hash algorithm
 * Fast, deterministic, zero-dependency hashing for uniform bucketing.
 */
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Computes an integer bucket [0, 99] deterministically for a flag and identifier.
 */
export function hashToBucket(flagKey: string, identifier: string): number {
  return fnv1a32(`${flagKey}:${identifier}`) % 100;
}

/**
 * Evaluates whether a single condition matches against the provided context.
 */
export function matchesCondition(condition: RuleCondition, context: UserContext): boolean {
  if (!condition || !condition.attribute) return false;

  const actualValue = context[condition.attribute];
  if (actualValue === undefined || actualValue === null) return false;

  const expectedValue = condition.value;

  try {
    switch (condition.operator) {
      case 'equals':
        return String(actualValue).toLowerCase() === String(expectedValue).toLowerCase();

      case 'notEquals':
        return String(actualValue).toLowerCase() !== String(expectedValue).toLowerCase();

      case 'in':
        if (!Array.isArray(expectedValue)) return false;
        return expectedValue
          .map((v) => String(v).toLowerCase())
          .includes(String(actualValue).toLowerCase());

      case 'notIn':
        if (!Array.isArray(expectedValue)) return false;
        return !expectedValue
          .map((v) => String(v).toLowerCase())
          .includes(String(actualValue).toLowerCase());

      case 'contains':
        return String(actualValue).toLowerCase().includes(String(expectedValue).toLowerCase());

      case 'startsWith':
        return String(actualValue).toLowerCase().startsWith(String(expectedValue).toLowerCase());

      case 'endsWith':
        return String(actualValue).toLowerCase().endsWith(String(expectedValue).toLowerCase());

      case 'greaterThan': {
        const actualNum = Number(actualValue);
        const expectedNum = Number(expectedValue);
        if (Number.isNaN(actualNum) || Number.isNaN(expectedNum)) return false;
        return actualNum > expectedNum;
      }

      case 'lessThan': {
        const actualNum = Number(actualValue);
        const expectedNum = Number(expectedValue);
        if (Number.isNaN(actualNum) || Number.isNaN(expectedNum)) return false;
        return actualNum < expectedNum;
      }

      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Pure evaluation function for feature flags.
 * Executes targeting rules and percentage bucketing in deterministic order.
 */
export function evaluateFlag(
  flag: FlagConfig | null | undefined,
  context: UserContext = {},
  defaultValue = false
): EvaluationResult {
  if (!flag) {
    return {
      enabled: defaultValue,
      reason: 'ARCHIVED_OR_MISSING',
    };
  }

  if (!flag.enabled) {
    return {
      enabled: false,
      reason: 'DISABLED',
    };
  }

  if (Array.isArray(flag.rules) && flag.rules.length > 0) {
    for (const rule of flag.rules) {
      if (!rule.conditions || rule.conditions.length === 0) continue;

      const allMatched = rule.conditions.every((cond) => matchesCondition(cond, context));
      if (allMatched) {
        if (typeof rule.serve === 'boolean') {
          return {
            enabled: rule.serve,
            reason: 'RULE_MATCH',
            matchedRuleId: rule.id,
          };
        }

        if (typeof rule.rolloutPercentage === 'number') {
          if (!context.userId) {
            return {
              enabled: false,
              reason: 'RULE_MATCH',
              matchedRuleId: rule.id,
            };
          }
          const bucket = hashToBucket(flag.key, String(context.userId));
          return {
            enabled: bucket < rule.rolloutPercentage,
            reason: 'RULE_MATCH',
            matchedRuleId: rule.id,
            bucket,
          };
        }
      }
    }
  }

  const defaultPercentage = flag.rolloutPercentage ?? 100;

  if (defaultPercentage <= 0) {
    const bucket = context.userId ? hashToBucket(flag.key, String(context.userId)) : undefined;
    return {
      enabled: false,
      reason: 'DEFAULT_ROLLOUT',
      bucket,
    };
  }

  if (defaultPercentage >= 100) {
    const bucket = context.userId ? hashToBucket(flag.key, String(context.userId)) : undefined;
    return {
      enabled: true,
      reason: 'DEFAULT_ROLLOUT',
      bucket,
    };
  }

  if (!context.userId) {
    return {
      enabled: false,
      reason: 'DEFAULT_ROLLOUT',
    };
  }

  const bucket = hashToBucket(flag.key, String(context.userId));
  return {
    enabled: bucket < defaultPercentage,
    reason: 'DEFAULT_ROLLOUT',
    bucket,
  };
}

export interface VexloClientOptions {
  apiKey: string;
  baseUrl: string;
  pollIntervalMs?: number;
  bootstrap?: Record<string, FlagConfig>;
  timeoutMs?: number;
}

export class VexloClient {
  private apiKey: string;
  private baseUrl: string;
  private pollIntervalMs: number;
  private timeoutMs: number;

  private flags: Map<string, FlagConfig> = new Map();
  private etag: string | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private initPromise: Promise<void>;
  private listeners: Set<() => void> = new Set();

  constructor(options: VexloClientOptions) {
    this.apiKey = options.apiKey.trim();
    this.baseUrl = options.baseUrl.trim().replace(/\/+$/, '');
    this.pollIntervalMs = options.pollIntervalMs ?? 30000;
    this.timeoutMs = options.timeoutMs ?? 5000;

    if (options.bootstrap) {
      for (const [key, cfg] of Object.entries(options.bootstrap)) {
        this.flags.set(key, cfg);
      }
    }

    if (!this.apiKey || !this.baseUrl) {
      if (import.meta.env.DEV) {
        console.warn(
          'VexloClient: Missing apiKey or baseUrl, running in bootstrap fallback mode.'
        );
      }
      this.initPromise = Promise.resolve();
      return;
    }

    this.initPromise = this.fetchConfig()
      .then(() => {})
      .catch((err: unknown) => {
        if (import.meta.env.DEV) {
          const message = err instanceof Error ? err.message : String(err);
          console.warn(
            'VexloClient: Initial configuration fetch failed, using fallback/bootstrap cache.',
            message
          );
        }
      })
      .finally(() => {
        this.startPolling();
      });
  }

  async ready(): Promise<void> {
    await this.initPromise;
  }

  isEnabled(flagKey: string, context?: UserContext, defaultValue = false): boolean {
    try {
      const flag = this.flags.get(flagKey);
      return evaluateFlag(flag, context, defaultValue).enabled;
    } catch {
      return defaultValue;
    }
  }

  evaluate(flagKey: string, context?: UserContext, defaultValue = false): EvaluationResult {
    try {
      const flag = this.flags.get(flagKey);
      return evaluateFlag(flag, context, defaultValue);
    } catch {
      return {
        enabled: defaultValue,
        reason: 'FALLBACK_DEFAULT',
      };
    }
  }

  getAllFlags(): Record<string, FlagConfig> {
    const obj: Record<string, FlagConfig> = {};
    for (const [k, v] of this.flags.entries()) {
      obj[k] = v;
    }
    return obj;
  }

  async refresh(): Promise<boolean> {
    if (!this.apiKey || !this.baseUrl) {
      return false;
    }
    try {
      return await this.fetchConfig();
    } catch {
      return false;
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  close(): void {
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  destroy(): void {
    this.close();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {
        // Isolate subscriber errors
      }
    }
  }

  private async fetchConfig(): Promise<boolean> {
    const url = `${this.baseUrl}/sdk/v1/config`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    };

    if (this.etag) {
      headers['If-None-Match'] = this.etag;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        headers,
        signal: controller.signal,
        cache: 'no-cache',
      });

      if (res.status === 304) {
        return true;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch flag config (status: ${res.status})`);
      }

      const body = (await res.json()) as {
        data: {
          etag: string;
          flags: Record<string, FlagConfig>;
        };
      };

      const newEtag = res.headers.get('etag') || body.data.etag;
      if (newEtag) {
        this.etag = newEtag;
      }

      if (body.data?.flags) {
        this.flags.clear();
        for (const [key, cfg] of Object.entries(body.data.flags)) {
          this.flags.set(key, cfg);
        }
        this.notifyListeners();
      }

      return true;
    } finally {
      clearTimeout(timeout);
    }
  }

  private startPolling(): void {
    if (this.pollIntervalMs <= 0 || this.pollTimer !== null) return;

    this.pollTimer = setInterval(async () => {
      try {
        await this.fetchConfig();
      } catch {
        // Silent recovery on polling failure, keeps last known config
      }
    }, this.pollIntervalMs);

    if (
      this.pollTimer &&
      typeof this.pollTimer === 'object' &&
      'unref' in (this.pollTimer as object)
    ) {
      (this.pollTimer as { unref?: () => void }).unref?.();
    }
  }
}
