

const BASE_URL = '/api/logs';   

let authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN || '';

export function setAuthToken(token?: string) {
  if (token) authToken = token;
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
    'api', 'component', 'hook', 'page', 'state', 'style',
    'auth', 'config', 'middleware', 'utils',
    'cache', 'controller', 'cron_job', 'db', 'domain', 'handler',
    'repository', 'route', 'service'
  ];

  if (!validStacks.includes(stack) || !validLevels.includes(level) || !validPackages.includes(pkg)) {
    console.warn(`Invalid Log parameters: ${stack}/${level}/${pkg}`);
    return;
  }

  if (!authToken) {
    console.warn("Auth token not found in .env");
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
    console.error('Logging failed:', error);
  }
}
