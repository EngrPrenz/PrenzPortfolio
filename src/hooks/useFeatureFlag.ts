import { useState, useEffect, useRef } from 'react';
import type { UserContext } from '@/lib/vexloSdk';
import { vexlo } from '@/lib/flags';

export function useFeatureFlag(
  flagKey: string,
  context?: UserContext,
  defaultValue = false
): boolean {
  const contextRef = useRef(context);
  contextRef.current = context;
  const contextKey = JSON.stringify(context ?? null);

  const [enabled, setEnabled] = useState(() =>
    vexlo.isEnabled(flagKey, contextRef.current, defaultValue)
  );

  useEffect(() => {
    let active = true;
    const sync = () => {
      if (!active) return;
      setEnabled(vexlo.isEnabled(flagKey, contextRef.current, defaultValue));
    };

    sync();
    vexlo.ready().then(sync);

    const unsubscribe = vexlo.subscribe(sync);

    const handleFocus = () => {
      vexlo.refresh().then(sync);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, [flagKey, defaultValue, contextKey]);

  return enabled;
}
