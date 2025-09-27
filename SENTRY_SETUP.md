# Sentry Setup (optional)
1. Create project on Sentry.io and get DSN.
2. Add SENTRY_DSN to your environment variables.
3. Example initialization (frontend):
```js
import * as Sentry from '@sentry/browser';
Sentry.init({ dsn: process.env.SENTRY_DSN });
```
