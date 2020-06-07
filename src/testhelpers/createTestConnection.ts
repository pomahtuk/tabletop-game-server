import { createConnection } from "typeorm";
import { User } from "../dao/entities/user";
import { Game } from "../dao/entities/game";

export default async function createTestConnection() {
  await createConnection({
    name: "default",
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [User, Game],
    synchronize: true,
    logging: false,
  });
}
