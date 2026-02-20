export function getSiteIdentifier() {
  const host = window.location.hostname;

  if (host.includes("localhost")) {
    return window.location.pathname.split("/")[2];
  }

  return host.split(".")[0];
}
