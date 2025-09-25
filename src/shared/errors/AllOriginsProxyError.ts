export class AllOriginsProxyError extends Error {
  public readonly originalUrl: string;
  public readonly method: "direct" | "proxy";

  constructor(
    message: string,
    originalUrl: string,
    method: "direct" | "proxy",
  ) {
    super(`API Error (${method}): ${message} (URL: ${originalUrl})`);
    this.name = "AllOriginsProxyError";
    this.originalUrl = originalUrl;
    this.method = method;
  }
}
