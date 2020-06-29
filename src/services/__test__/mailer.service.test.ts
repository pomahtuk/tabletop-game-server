import { MailerService, MailerServiceImpl } from "../mailer.service";
import nodemailer from "nodemailer";

describe("MailerService", (): void => {
  let mailerService: MailerService;

  it("Exports MailerServiceImpl", (): void => {
    expect(MailerServiceImpl).toBeDefined();
  });

  it("Able to instantiate MailerServiceImpl from env", (): void => {
    const service = new MailerServiceImpl();
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(MailerServiceImpl);
  });

  it("Able to instantiate MailerServiceImpl from options", async (): Promise<
    void
  > => {
    let testAccount = await nodemailer.createTestAccount();

    mailerService = new MailerServiceImpl({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      user: testAccount.user,
      pass: testAccount.pass,
    });
  });

  // TODO: Error: Greeting never received - under VPN
  it("Can send password reset email", async (): Promise<void> => {
    let result = await mailerService.sendResetEmail({
      id: "test",
      username: "test",
      password: "none",
      email: "pman89@ya.ru",
      passwordResetToken: "test token",
      passwordResetTokenExpiresAt: new Date(),
    });

    expect(result).toBeDefined();
  }, 30000);

  it("Can send activation email", async (): Promise<void> => {
    let result = await mailerService.sendActivationEmail({
      id: "test",
      username: "test",
      password: "none",
      email: "pman89@ya.ru",
      activationCode: "some",
    });

    expect(result).toBeDefined();
  }, 30000);
});
