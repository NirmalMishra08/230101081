// logging_middleware/logger.ts
const BASE_URL = 'http://4.224.186.213/evaluation-service/logs';

let authToken = '';   // Will be set once

export function setAuthToken(token: string) {
  authToken = token;
}

export async function Log(
  stack: 'backend' | 'frontend',
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
  pkg: string,
  message: string
) {
  const validStacks = ['backend', 'frontend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const validPackages = [
    'api', 'component', 'hook', 'page', 'state', 'style',   // frontend
    'auth', 'config', 'middleware', 'utils',                // shared
    'cache', 'controller', 'cron_job', 'db', 'domain', 'handler',
    'repository', 'route', 'service'                        // backend
  ];

  if (!validStacks.includes(stack) || !validLevels.includes(level) || !validPackages.includes(pkg)) {
    console.warn(`Invalid Log parameters: ${stack}, ${level}, ${pkg}`);
    return;
  }

  if (!authToken) {
    console.warn("Auth token not set for logging");
    return;
  }

  const payload = { stack, level, package: pkg, message: String(message) };

  try {
    await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Silent fail - don't break the app if logging fails
    console.error('Logging failed:', error);
  }
}