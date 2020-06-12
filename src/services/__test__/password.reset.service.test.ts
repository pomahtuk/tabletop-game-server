import { UsersService } from "../users.service";
import createTestConnection from "../../testhelpers/createTestConnection";
import { PasswordResetService } from "../password.reset.service";
import { HttpException } from "../../exceptions/httpException";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "http-status-codes";
import ValidationException from "../../exceptions/validationException";
import { MailerService } from "../mailer.service";
import { User } from "../../dao/entities/user";

class FakeMailer implements MailerService {
  private readonly sender: (user: User) => any;

  constructor(sender: (user: User) => any) {
    this.sender = sender;
  }

  public async sendResetEmail(user: User): Promise<any> {
    this.sender(user);
  }
}

describe("PasswordResetService", () => {
  let usersService: UsersService;
  let mailerService: MailerService;
  let passwordResetService: PasswordResetService;
  let mailFakeSender = jest.fn();

  const TEST_USER_EMAIL = "random.user.test@example.com";

  beforeAll(
    async (): Promise<void> => {
      await createTestConnection();
      usersService = new UsersService();
      mailerService = new FakeMailer(mailFakeSender);

      // create user
      await usersService.createUser({
        email: TEST_USER_EMAIL,
        username: "does_not_matter",
        password: "123456",
      });
    }
  );

  it("Exports service", (): void => {
    expect(PasswordResetService).toBeDefined();
  });

  it("Able to create instance of service", (): void => {
    passwordResetService = new PasswordResetService(
      usersService,
      mailerService
    );
    expect(passwordResetService).toBeInstanceOf(PasswordResetService);
  });

  it("Able to start reset procedure", async (): Promise<void> => {
    await passwordResetService.startPasswordReset(TEST_USER_EMAIL);

    const user = await usersService.getUserByEmail(TEST_USER_EMAIL);
    expect(user.passwordResetToken).toHaveLength(10);
    expect(user.passwordResetTokenExpiresAt?.getTime()).toBeLessThan(
      Date.now() + 30 * 60 * 1000
    );
    expect(mailFakeSender).toHaveBeenCalled();
  });

  it("Would not reset password when password does not pass validation", async (): Promise<
    void
  > => {
    expect.assertions(3);
    const { passwordResetToken } = await usersService.getUserByEmail(
      TEST_USER_EMAIL
    );
    try {
      await passwordResetService.resetPassword({
        email: TEST_USER_EMAIL,
        token: passwordResetToken!,
        password: "123",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ValidationException);
      expect(error.status).toBe(BAD_REQUEST);
    }
  });

  it("Able to reset password", async (): Promise<void> => {
    const { passwordResetToken, password } = await usersService.getUserByEmail(
      TEST_USER_EMAIL
    );
    await passwordResetService.resetPassword({
      email: TEST_USER_EMAIL,
      token: passwordResetToken!,
      password: "564321",
    });

    const user = await usersService.getUserByEmail(TEST_USER_EMAIL);

    expect(user.passwordResetToken).toBe(null);
    expect(user.passwordResetTokenExpiresAt).toBe(null);
    expect(user.password).not.toBe(password);
  });

  it("Would not reset password when flow not initiated or completed or token invalid", async (): Promise<
    void
  > => {
    expect.assertions(3);
    try {
      await passwordResetService.resetPassword({
        email: TEST_USER_EMAIL,
        token: "1111",
        password: "564321",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(UNAUTHORIZED);
    }
  });

  // expired token
  it("Would not reset password if token is expired", async (): Promise<
    void
  > => {
    const user = await usersService.getUserByEmail(TEST_USER_EMAIL);
    user.passwordResetTokenExpiresAt = new Date();
    await usersService.saveUser(user);

    expect.assertions(4);
    try {
      await passwordResetService.resetPassword({
        email: TEST_USER_EMAIL,
        token: user.passwordResetToken!,
        password: "564321",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(UNAUTHORIZED);
      expect(error.message).toBe("Password reset token expired.");
    }
  });

  it("Would not start procedure for non-existing user", async (): Promise<
    void
  > => {
    expect.assertions(3);
    try {
      await passwordResetService.resetPassword({
        email: "some@email.com",
        token: "1111",
        password: "564321",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(NOT_FOUND);
    }
  });
});
