import { HttpException } from "../httpException";
import { NOT_FOUND } from "http-status-codes";

describe("Exceptions", (): void => {
  it("Exports exception", () => {
    expect(HttpException).toBeDefined();
  });

  it("HttpException preservers status code of exception", () => {
    const exception = new HttpException("test", NOT_FOUND);
    expect(exception).toBeDefined();
    expect(exception.message).toBe("test");
    expect(exception.status).toBe(NOT_FOUND);
  });
});
