import ValidationException from "../validationException";
import { BAD_REQUEST } from "http-status-codes";

describe("ValidationException", (): void => {
  it("Exports exception", () => {
    expect(ValidationException).toBeDefined();
  });

  it("ValidationException without errors have BAD_REQUEST status and no errors mentioned in message", (): void => {
    const exception = new ValidationException("test");
    expect(exception).toBeDefined();
    expect(exception.message).toBe("test");
    expect(exception.errors).not.toBeDefined();
    expect(exception.status).toBe(BAD_REQUEST);
  });

  it("ValidationException with errors have BAD_REQUEST status and errors mentioned in message", (): void => {
    const exception = new ValidationException("test", ["validation_error"]);
    expect(exception).toBeDefined();
    expect(exception.message).toContain("test");
    expect(exception.message).toContain("validation_error");
    expect(exception.errors).toHaveLength(1);
    expect(exception.status).toBe(BAD_REQUEST);
  });
});
