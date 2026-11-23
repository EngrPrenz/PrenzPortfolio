import { VexloClient } from '@/lib/vexloSdk';

const isDev = import.meta.env.DEV;

export const vexlo = new VexloClient({
  apiKey:
    import.meta.env.VITE_VEXLO_API_KEY ||
    (isDev
      ? 'vx_development_08de530a11ca2282e448e09feec0d239a11cc0c3dcee0ba1'
      : ''),
  baseUrl:
    import.meta.env.VITE_VEXLO_URL ||
    (isDev ? 'http://localhost:4000' : ''),
  pollIntervalMs: isDev ? 3000 : 30000,
  bootstrap: {
    'skill-tech-logos': {
      key: 'skill-tech-logos',
      enabled: true,
      rolloutPercentage: 100,
      rules: [],
    },
    redesign: {
      key: 'redesign',
      enabled: true,
      rolloutPercentage: 100,
      rules: [],
    },
  },
});
