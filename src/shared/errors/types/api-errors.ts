/**
 * Generic error hierarchy for external API integrations
 * Provides a scalable foundation for handling errors from multiple APIs
 */

/**
 * Base class for all external API errors
 * Provides common structure and behavior for API-specific errors
 */
export abstract class ExternalApiError extends Error {
  public service: string;
  public status?: number;
  public originalError?: Error;

  constructor(
    service: string,
    message: string,
    status?: number,
    originalError?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.service = service;
    this.status = status;
    this.originalError = originalError;
  }

  /**
   * Creates a structured log object for monitoring/debugging
   */
  toLogObject() {
    return {
      name: this.name,
      service: this.service,
      message: this.message,
      status: this.status,
      originalError: this.originalError?.message,
      stack: this.stack,
    };
  }
}

/**
 * Authentication/Authorization errors (401, 403)
 * Used when API keys are invalid, expired, or lack permissions
 */
export class AuthenticationError extends ExternalApiError {
  constructor(service: string, details?: string) {
    const message = details
      ? `${service} API Authentication failed: ${details}`
      : `${service} API Authentication failed: Invalid API key`;
    super(service, message, 401);
  }
}

/**
 * Resource not found errors (404)
 * Used when specific resources don't exist
 */
export class ResourceNotFoundError extends ExternalApiError {
  constructor(service: string, resourceType: string, resourceId: string) {
    const capitalizedResourceType =
      resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
    super(
      service,
      `${capitalizedResourceType} not found: ID ${resourceId} does not exist`,
      404,
    );
    // Store additional context for debugging
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  public readonly resourceType: string;
  public readonly resourceId: string;
}

/**
 * Rate limit exceeded errors (429)
 * Used when API quotas are exceeded
 */
export class RateLimitError extends ExternalApiError {
  constructor(service: string, retryAfter?: number) {
    const message = retryAfter
      ? `${service} API rate limit exceeded. Retry after ${retryAfter} seconds`
      : `${service} API rate limit exceeded. Please try again later`;
    super(service, message, 429);
    this.retryAfter = retryAfter;
  }

  public readonly retryAfter?: number;
}

/**
 * Server errors (500, 502, 503, 504)
 * Used for upstream server issues
 */
export class ServerError extends ExternalApiError {
  constructor(service: string, status: number = 500) {
    super(
      service,
      `${service} API server error. Please try again later`,
      status,
    );
  }
}

/**
 * Network connectivity errors
 * Used for DNS, connection, timeout, and CORS issues
 */
export class NetworkError extends ExternalApiError {
  constructor(service: string, originalError: Error) {
    super(
      service,
      `Network error occurred while fetching from ${service} API`,
      undefined,
      originalError,
    );
  }
}

/**
 * Request timeout errors
 * Used when requests take too long to complete
 */
export class TimeoutError extends ExternalApiError {
  constructor(service: string, timeoutMs?: number) {
    const message = timeoutMs
      ? `Request to ${service} API timed out after ${timeoutMs}ms`
      : `Request to ${service} API timed out`;
    super(service, message);
  }
}

/**
 * Data validation errors
 * Used for invalid input parameters or malformed responses
 */
export class ValidationError extends ExternalApiError {
  constructor(service: string, validationMessage: string) {
    super(service, `${service} validation error: ${validationMessage}`);
  }
}

/**
 * JSON parsing errors
 * Used when API responses are not valid JSON
 */
export class ParseError extends ExternalApiError {
  constructor(service: string, originalError?: Error) {
    super(
      service,
      `Invalid ${service} response: Response is not valid JSON`,
      undefined,
      originalError,
    );
  }
}
