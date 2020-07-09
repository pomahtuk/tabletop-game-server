import {
  hashPassword,
  passwordMessage,
  passwordSizeMessage,
  validatePassword,
} from "../password";
import crypto from "crypto";

describe("Password helpers", (): void => {
  it("Exports hashing function", (): void => {
    expect(hashPassword).toBeDefined();
  });

  it("Can hash password", async (): Promise<void> => {
    const PWD = "123456";
    const hashed = await hashPassword(PWD);
    expect(hashed).not.toBe(PWD);
  });

  it("Exports validation function", (): void => {
    expect(validatePassword).toBeDefined();
  });

  it("Does not validate empty password", async (): Promise<void> => {
    const error = await validatePassword();
    expect(error).not.toBeDefined();
  });

  it("Can handle valid password", async (): Promise<void> => {
    const validPwd = "123456";
    const error = await validatePassword(validPwd);
    expect(error).not.toBeDefined();
  });

  it("Can return error for password too short", async (): Promise<void> => {
    const pwd = "123";
    const error = await validatePassword(pwd);
    expect(error).toBeDefined();
    expect(error?.constraints?.length).toBeDefined();
    expect(error?.constraints?.length).toBe(passwordSizeMessage);
  });

  it("Can return error for password too long", async (): Promise<void> => {
    const pwd = crypto.randomBytes(256).toString("hex");
    const error = await validatePassword(pwd);
    expect(error).toBeDefined();
    expect(error?.constraints?.length).toBeDefined();
    expect(error?.constraints?.length).toBe(passwordSizeMessage);
  });

  it("Can return error for password regex", async (): Promise<void> => {
    const pwd = "123 121212";
    const error = await validatePassword(pwd);
    expect(error).toBeDefined();
    expect(error?.constraints?.matches).toBeDefined();
    expect(error?.constraints?.matches).toBe(passwordMessage);
  });
});
