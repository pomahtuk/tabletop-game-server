import server from "../../../index";
import { Game } from "dao/entities/game";

const ROUTE_PREFIX = "/game";

describe("Game routes", (): void => {
  afterAll(() => {
    server.close();
  });

  beforeAll(async () => await server.ready());

  test("responds with 200 on request list with no games", async (done) => {
    const response = await server.inject({
      method: "GET",
      url: ROUTE_PREFIX + "s",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("[]");
    done();
  });

  test("responds with 200 on request list with no games", async (done) => {
    const response = await server.inject({
      method: "POST",
      url: ROUTE_PREFIX,
      payload: {
        users: [],
      },
    });

    expect(response.statusCode).toBe(200);
    const game: Game = JSON.parse(response.body);
    expect(game.id).toBeDefined();
    expect(game.users).toMatchObject([]);
    done();
  });
});
