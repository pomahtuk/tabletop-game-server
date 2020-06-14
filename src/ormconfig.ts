import * as url from "url";

let type = "sqlite";
let database = "db";
let port = undefined;
let host = undefined;
let username = undefined;
let password = undefined;

const dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.length > 0) {
  const parsed = url.parse(dbUrl);
  type = parsed.protocol!.substr(0, parsed.protocol!.length - 1);
  username = parsed.auth!.split(":")[0];
  password = parsed.auth!.split(":")[1];
  host = parsed.host!.split(":")[0];
  database = parsed.path!.substr(1, parsed.path!.length);
  port = parsed.port;
}

export const OrmConfig = {
  type,
  database,
  port,
  host,
  username,
  password,
  name: "default",
  migrationsRun: true,
  migrations: [__dirname + "/dao/migrations/*.{js,ts}"],
  entities: [__dirname + "/dao/entities/*.{js,ts}"],
  cli: {
    entitiesDir: __dirname + "/dao/entities",
    migrationsDir: __dirname + "/dao/migrations",
    subscribersDir: __dirname + "/dao/subscribers",
  },
};
