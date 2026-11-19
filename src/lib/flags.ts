import { FlagpostClient } from '@flagpost/sdk';

export const flagpost = new FlagpostClient({
    apiKey: 'fp_production_08de530a11ca2282e448e09feec0d239a11cc0c3dcee0ba0',
    baseUrl: 'http://localhost:4000',
    pollIntervalMs: 15000, // Polls every 15s using ETags (304 Not Modified)
    bootstrap: {
        'show-flagpost-showcase': {
            key: 'show-flagpost-showcase',
            enabled: true,
            rolloutPercentage: 100,
            rules: [],
        },
    },
});
