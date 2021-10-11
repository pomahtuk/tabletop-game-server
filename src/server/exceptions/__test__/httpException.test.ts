import { StatusCodes } from "http-status-codes";
import { HttpException } from "../httpException";

describe("HttpException", (): void => {
  it("Exports exception", () => {
    expect(HttpException).toBeDefined();
  });

  it("HttpException preservers status code of exception", (): void => {
    const exception = new HttpException("test", StatusCodes.BAD_REQUEST);
    expect(exception).toBeDefined();
    expect(exception.message).toBe("test");
    expect(exception.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("HttpException preservers info about original exception", (): void => {
    const exception = new HttpException(
      "test",
      StatusCodes.BAD_REQUEST,
      new Error("origin")
    );
    expect(exception).toBeDefined();
    expect(exception.message).toBe("test");
    expect(exception.status).toBe(StatusCodes.BAD_REQUEST);
    expect(exception.origin).toBeDefined();
    expect(exception.origin?.message).toBe("origin");
  });
});
