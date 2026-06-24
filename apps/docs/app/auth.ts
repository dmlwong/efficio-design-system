export const DESIGN_SYSTEM_SESSION_STORAGE_KEY = 'orbit-design-system-session';
const DESIGN_SYSTEM_SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export interface DesignSystemSession {
  name: string;
  signedInAt: string;
}

function readSessionCookie() {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${DESIGN_SYSTEM_SESSION_STORAGE_KEY}=`));

  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.slice(DESIGN_SYSTEM_SESSION_STORAGE_KEY.length + 1));
  } catch {
    return null;
  }
}

function writeSessionCookie(value: string) {
  if (typeof document === 'undefined') return;

  document.cookie = [
    `${DESIGN_SYSTEM_SESSION_STORAGE_KEY}=${encodeURIComponent(value)}`,
    'path=/',
    `max-age=${DESIGN_SYSTEM_SESSION_COOKIE_MAX_AGE}`,
    'samesite=lax',
  ].join('; ');
}

function clearSessionCookie() {
  if (typeof document === 'undefined') return;

  document.cookie = `${DESIGN_SYSTEM_SESSION_STORAGE_KEY}=; path=/; max-age=0; samesite=lax`;
}

function readStoredSessionValue() {
  try {
    return window.localStorage?.getItem(DESIGN_SYSTEM_SESSION_STORAGE_KEY) ?? readSessionCookie();
  } catch {
    return readSessionCookie();
  }
}

export function readDesignSystemSession() {
  const storedSession = readStoredSessionValue();
  if (!storedSession) return null;

  try {
    return JSON.parse(storedSession) as DesignSystemSession;
  } catch {
    return null;
  }
}

export function writeDesignSystemSession(session: DesignSystemSession) {
  const serializedSession = JSON.stringify(session);

  try {
    window.localStorage?.setItem(DESIGN_SYSTEM_SESSION_STORAGE_KEY, serializedSession);
  } catch {
    // Cookie fallback keeps the passwordless gate working when localStorage is unavailable.
  }

  writeSessionCookie(serializedSession);
}

export function clearDesignSystemSession() {
  try {
    window.localStorage?.removeItem(DESIGN_SYSTEM_SESSION_STORAGE_KEY);
  } catch {
    // Cookie removal below is the fallback path.
  }

  clearSessionCookie();
}

export function getSafeDesignSystemNextPath(value: string | null | undefined) {
  if (!value) return '/design-system';

  const isDesignSystemPath =
    value === '/design-system' ||
    value.startsWith('/design-system/') ||
    value.startsWith('/design-system?') ||
    value.startsWith('/design-system#');

  return isDesignSystemPath ? value : '/design-system';
}
