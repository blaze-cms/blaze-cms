export class BlazeError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "BlazeError";
  }
}

export class NotFoundError extends BlazeError {
  constructor(resource: string, id: string) {
    super(`${resource} "${id}" not found`, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends BlazeError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}
