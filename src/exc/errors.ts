import * as status from "http-status";

/**
 * Generic Service Error
 */
class ServiceError extends Error {
  private status: number;
  private cause: Error;
  constructor(statusCode: number, message: string, cause?: Error) {
    super(message);
    this.status = statusCode;
    this.cause = cause;
  }
}

/**
 * Stat Not Found Error
 */
class StatsNotFoundError extends ServiceError {
  constructor(message: string) {
    super(status.NOT_FOUND, message);
  }
}

export { ServiceError, StatsNotFoundError };
