import server from "../../index";

describe("Status routes", (): void => {
  afterAll(() => {
    server.close();
  });

  beforeAll(async () => await server.ready());

  test("responds with 200 on request status route", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/status",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch('"works":true');
  });
});
