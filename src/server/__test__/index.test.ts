import server from "../index";

describe("server test", (): void => {
  afterAll(() => {
    server.close();
  });

  beforeAll(async () => await server.ready());

  test("responds with 404 on request /", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(404);
  });
});
