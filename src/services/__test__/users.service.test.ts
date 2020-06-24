import { UsersService } from "../users.service";
import createTestConnection from "../../testhelpers/createTestConnection";
import { BAD_REQUEST } from "http-status-codes";
import { v4 } from "uuid";

describe("UsersService", () => {
  let usersService: UsersService;

  const TEST_USER_EMAIL = "random.user.test@example.com";
  const TEST_USER_ACTIVATION_CODE = v4();
  let testUserId: string;

  beforeAll(
    async (): Promise<void> => {
      await createTestConnection();
    }
  );

  it("Exports service", (): void => {
    expect(UsersService).toBeDefined();
  });

  it("Able to create instance of service", (): void => {
    usersService = new UsersService();
    expect(usersService).toBeInstanceOf(UsersService);
  });

  it("Returns empty list of users with new DB", async (): Promise<void> => {
    const users = await usersService.getUsers();
    expect(users.length).toBe(0);
  });

  it("Can create user", async (): Promise<void> => {
    const username = "testuser1";
    const password = "super_secure_password";

    const created = await usersService.createUser({
      email: TEST_USER_EMAIL,
      username,
      password,
      activationCode: TEST_USER_ACTIVATION_CODE,
    });

    expect(created).toBeDefined();
    expect(created.email).toBe(TEST_USER_EMAIL);
    expect(created.username).toBe(username);
    expect(created.password).toBe(password);
    expect(created.activationCode).toBe(TEST_USER_ACTIVATION_CODE);

    testUserId = created.id as string;
  });

  it("Returns list of users after initial insert", async (): Promise<void> => {
    const users = await usersService.getUsers();
    expect(users.length).toBe(1);
  });

  it("Returns error on creating user with existing username", async (): Promise<
    void
  > => {
    expect.assertions(2);

    const email = "random.user.test.exitsing.username@example.com";
    const username = "testuser1";
    const password = "super_secure_password";

    try {
      await usersService.createUser({
        email,
        username,
        password,
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        "User with that email or username already exists"
      );
    }
  });

  it("Returns error on creating user with existing email", async (): Promise<
    void
  > => {
    expect.assertions(2);

    const username = "testuser2";
    const password = "super_secure_password";

    try {
      await usersService.createUser({
        email: TEST_USER_EMAIL,
        username,
        password,
      });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        "User with that email or username already exists"
      );
    }
  });

  it("Can get user by email", async (): Promise<void> => {
    const user = await usersService.getUserByEmail(
      "random.user.test@example.com"
    );
    expect(user).toBeDefined();
    expect(user.email).toBe(TEST_USER_EMAIL);
  });

  it("Can get user by id", async (): Promise<void> => {
    const user = await usersService.getUser(testUserId);
    expect(user).toBeDefined();
    expect(user.id).toBe(testUserId);
  });

  it("Can get user by activation code", async (): Promise<void> => {
    const user = await usersService.getUserByActivationCode(
      TEST_USER_ACTIVATION_CODE
    );
    expect(user).toBeDefined();
    expect(user.id).toBe(testUserId);
    expect(user.activationCode).toBe(TEST_USER_ACTIVATION_CODE);
  });

  it("Can update user", async (): Promise<void> => {
    const updated = await usersService.updateUser(testUserId, {
      username: "updated",
    });

    expect(updated).toBeDefined();
    expect(updated.username).toBe("updated");
  });

  it("Does not allow overriding user id", async (): Promise<void> => {
    expect.assertions(2);
    try {
      await usersService.updateUser(testUserId, {
        id: "some",
        username: "updated",
      });
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toBe("Changing User id is forbidden");
    }
  });

  it("Does not allow saving user with same email", async (): Promise<void> => {
    expect.assertions(3);
    try {
      await usersService.saveUser({
        username: "updated111111",
        email: TEST_USER_EMAIL,
        password: "1234567890",
      });
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.status).toBe(BAD_REQUEST);
      expect(exception.message).toBe(
        "User with that email or username already exists"
      );
    }
  });

  it("Throwing validation error when username is too short", async (): Promise<
    void
  > => {
    expect.assertions(2);
    const userWithShortPassword = {
      username: "srt",
      password: "hello_there_!",
      email: "test_validation@example.com",
    };
    try {
      await usersService.createUser(userWithShortPassword);
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toContain(
        "Must be between 4 and 255 characters long"
      );
    }
  });

  it("Throwing validation error when username does not match regex", async (): Promise<
    void
  > => {
    expect.assertions(2);
    const userWithShortPassword = {
      username: "hello there",
      password: "hello_there_!",
      email: "test_validation@example.com",
    };
    try {
      await usersService.createUser(userWithShortPassword);
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toContain(
        "Can only contain numbers, letters and symbols"
      );
    }
  });

  it("Can delete user", async (): Promise<void> => {
    const user = await usersService.createUser({
      email: "non_existent@example.com",
      username: "new_test_user",
      password: "test+password",
    });
    const deletionResult = await usersService.deleteUser(user.id as string);
    expect(deletionResult).toBeDefined();
  });

  it("Returns error when setting user email to already existing one", async (): Promise<
    void
  > => {
    expect.assertions(2);
    const user = await usersService.createUser({
      email: "non_existent@example.com",
      username: "new_test_user",
      password: "test+password",
    });
    try {
      await usersService.updateUser(testUserId, {
        email: user.email,
      });
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toBe(
        "User with that email or username already exists"
      );
    }
    await usersService.deleteUser(user.id as string);
  });

  it("Returns error when setting user username to already existing one", async (): Promise<
    void
  > => {
    expect.assertions(2);
    const user = await usersService.createUser({
      email: "non_existent1@example.com",
      username: "new_test_user1",
      password: "test+password",
    });
    try {
      await usersService.updateUser(testUserId, {
        username: user.username,
      });
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toBe(
        "User with that email or username already exists"
      );
    }
    await usersService.deleteUser(user.id as string);
  });

  it("Throwing error when user with given id does not exist", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await usersService.getUser("111");
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toBe("User with this id does not exist");
    }
  });

  it("Throwing error when user with given email does not exist", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await usersService.getUserByEmail("111");
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toBe("User with this email does not exist");
    }
  });

  it("Trowing an error when user with given activationCode does not exist", async (): Promise<
    void
  > => {
    expect.assertions(2);
    try {
      await usersService.getUserByActivationCode("111");
    } catch (exception) {
      expect(exception).toBeDefined();
      expect(exception.message).toBe(
        "User with this activation code does not exist"
      );
    }
  });
});
