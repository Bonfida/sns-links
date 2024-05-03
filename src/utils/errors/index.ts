export class SnsClientError extends Error {
  cause?: unknown;

  constructor(message?: string, cause?: unknown) {
    super(message ?? `Unexpected error.`);

    // Ensure the stack trace is correctly captured in environments that support it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SnsClientError);
    }

    // Dynamically set the error name to the class name
    this.name = this.constructor.name;

    // Include the cause in the error if it's provided
    if (cause) {
      this.cause = cause;
    }
  }
}
