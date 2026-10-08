export const productionContactOrigin = "https://sonbolabs.exceptionalgrp.com";

export function isAllowedContactOrigin(origin: string | null, environment = process.env.NODE_ENV) {
  if (environment === "production") return origin === productionContactOrigin;
  return origin === productionContactOrigin || origin === "http://localhost:3000";
}
