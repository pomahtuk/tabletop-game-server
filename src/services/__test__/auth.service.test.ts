import createTestConnection from "../../testhelpers/createTestConnection";
import { AuthService } from "../auth.service";
import { UsersService } from "../users.service";
import { User } from "../../dao/entities/user";
import { HttpException } from "../../exceptions/httpException";
import ValidationException from "../../exceptions/validationException";
import { NOT_FOUND, UNAUTHORIZED } from "http-status-codes";
import { FakeMailer } from "../../testhelpers/fakemailer";
import { MailerService } from "../mailer.service";

describe("UsersService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let mailerService: MailerService;
  let mailFakeSender = jest.fn();

  const TEST_EMAIL = "sample_auth_user@example.com";
  const TEST_PWD = "i_am_a_password";
  const TEST_USERNAME = "sample_auth_username";

  let userActivationCode: string;

  beforeAll(
    async (): Promise<void> => {
      await createTestConnection();
      usersService = new UsersService();
      mailerService = new FakeMailer(mailFakeSender);
    }
  );

  it("Exports service", (): void => {
    expect(AuthService).toBeDefined();
  });

  it("Able to create instance of service", (): void => {
    authService = new AuthService(usersService, mailerService);
    expect(authService).toBeInstanceOf(AuthService);
  });

  it("Able to register user", async (): Promise<void> => {
    const newUser = await authService.register({
      username: TEST_USERNAME,
      password: TEST_PWD,
      email: TEST_EMAIL,
    });

    expect(newUser).toBeDefined();
    expect(newUser).toBeInstanceOf(User);
    expect(newUser.password).not.toBeDefined();
    expect(newUser.username).toBe(TEST_USERNAME);
    expect(newUser.email).toBe(TEST_EMAIL);
    expect(newUser.activationCode).toBeDefined();
    expect(newUser.isActive).toBeFalsy();

    userActivationCode = newUser.activationCode!;

    const dbUser = await usersService.getUserByEmail(TEST_EMAIL);
    expect(dbUser).toBeDefined();
    expect(dbUser.password).not.toBe(TEST_PWD);
    // mail suppose to be sent
    expect(mailFakeSender).toHaveBeenCalled();
  });

  it("Does not register user with existing email", async (): Promise<void> => {
    expect.assertions(2);
    try {
      await authService.register({
        username: TEST_USERNAME + "1",
        password: "i_am_a_password",
        email: TEST_EMAIL,
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toContain(
        "User with that email or username already exists"
      );
    }
  });

  it("Does not register user with existing username", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await authService.register({
        username: TEST_USERNAME,
        password: TEST_PWD,
        email: "sample_auth_user1@example.com",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toContain(
        "User with that email or username already exists"
      );
    }
  });

  it("Does not register user with invalid password", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await authService.register({
        username: "sample_auth_username1",
        password: "1",
        email: "sample_auth_user1@example.com",
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toContain(
        "property password has failed the following constraints"
      );
    }
  });

  it("does not authenticate not activated user", async (): Promise<void> => {
    expect.assertions(2);
    try {
      await authService.getAuthenticatedUser(TEST_EMAIL, TEST_PWD);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.status).toBe(UNAUTHORIZED);
    }
  });

  it("Able to activate user with valid code", async (): Promise<void> => {
    const activatedUser = await authService.activateUser(userActivationCode);
    expect(activatedUser).toBeDefined();
    expect(activatedUser.isActive).toBeTruthy();
    expect(activatedUser.activationCode).toBe(null);
  });

  it("Able to authenticate valid user/pwd pair", async (): Promise<void> => {
    const user = await authService.getAuthenticatedUser(TEST_EMAIL, TEST_PWD);
    expect(user).toBeDefined();
    expect(user.password).not.toBeDefined();
    expect(user.username).toBe(TEST_USERNAME);
  });

  it("Able to return proper error on not found user", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await authService.getAuthenticatedUser("random.email@me.com", TEST_PWD);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.status).toBe(NOT_FOUND);
    }
  });

  it("Able to return proper error on incorrect password", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await authService.getAuthenticatedUser(TEST_EMAIL, "random");
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.status).toBe(UNAUTHORIZED);
    }
  });
});
