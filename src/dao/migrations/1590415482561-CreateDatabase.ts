import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1590415482561 implements MigrationInterface {
  name = "CreateDatabase1590415482561";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "game" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( status IN ('not_started','in_progress','finished') ) NOT NULL DEFAULT ('not_started'))`
    );
    await queryRunner.query(
      `CREATE TABLE "game_users_user" ("gameId" varchar NOT NULL, "userId" varchar NOT NULL, PRIMARY KEY ("gameId", "userId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18b373498a08ccdb4991621346" ON "game_users_user" ("gameId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ee59806810ce428fa196a6120" ON "game_users_user" ("userId") `
    );
    await queryRunner.query(`DROP INDEX "IDX_18b373498a08ccdb4991621346"`);
    await queryRunner.query(`DROP INDEX "IDX_1ee59806810ce428fa196a6120"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_game_users_user" ("gameId" varchar NOT NULL, "userId" varchar NOT NULL, CONSTRAINT "FK_18b373498a08ccdb49916213460" FOREIGN KEY ("gameId") REFERENCES "game" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_1ee59806810ce428fa196a61203" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("gameId", "userId"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_game_users_user"("gameId", "userId") SELECT "gameId", "userId" FROM "game_users_user"`
    );
    await queryRunner.query(`DROP TABLE "game_users_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_game_users_user" RENAME TO "game_users_user"`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18b373498a08ccdb4991621346" ON "game_users_user" ("gameId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ee59806810ce428fa196a6120" ON "game_users_user" ("userId") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_1ee59806810ce428fa196a6120"`);
    await queryRunner.query(`DROP INDEX "IDX_18b373498a08ccdb4991621346"`);
    await queryRunner.query(
      `ALTER TABLE "game_users_user" RENAME TO "temporary_game_users_user"`
    );
    await queryRunner.query(
      `CREATE TABLE "game_users_user" ("gameId" varchar NOT NULL, "userId" varchar NOT NULL, PRIMARY KEY ("gameId", "userId"))`
    );
    await queryRunner.query(
      `INSERT INTO "game_users_user"("gameId", "userId") SELECT "gameId", "userId" FROM "temporary_game_users_user"`
    );
    await queryRunner.query(`DROP TABLE "temporary_game_users_user"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_1ee59806810ce428fa196a6120" ON "game_users_user" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_18b373498a08ccdb4991621346" ON "game_users_user" ("gameId") `
    );
    await queryRunner.query(`DROP INDEX "IDX_1ee59806810ce428fa196a6120"`);
    await queryRunner.query(`DROP INDEX "IDX_18b373498a08ccdb4991621346"`);
    await queryRunner.query(`DROP TABLE "game_users_user"`);
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
