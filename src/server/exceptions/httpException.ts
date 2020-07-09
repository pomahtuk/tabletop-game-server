export class HttpException extends Error {
  status: number;
  origin?: Error;

  constructor(message: string, status: number, exception?: Error) {
    super(message);
    this.status = status;

    // in production - do not maintain original fields
    if (process.env.NODE_ENV !== "production" && exception) {
      this.origin = exception;
    }
  }
}
