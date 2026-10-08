const domainLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

function isDomain(hostname: string) {
  const labels = hostname.split(".");
  return labels.length >= 2 && labels.every((label) => domainLabel.test(label));
}

/** Returns a canonical HTTPS/HTTP URL, or undefined when the value is invalid. */
export function normalizeWebsite(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (!isDomain(url.hostname) || !["http:", "https:"].includes(url.protocol)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
