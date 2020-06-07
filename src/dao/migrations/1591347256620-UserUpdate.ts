import { MigrationInterface, QueryRunner } from "typeorm";

export class UserUpdate1591347256620 implements MigrationInterface {
  name = "UserUpdate1591347256620";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_game" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( status IN ('not_started','in_progress','finished') ) NOT NULL DEFAULT ('not_started'))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_game"("id", "status") SELECT "id", "status" FROM "game"`
    );
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`ALTER TABLE "temporary_game" RENAME TO "game"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id") SELECT "id" FROM "user"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "username" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id") SELECT "id" FROM "user"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_game" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( status IN ('not_started','in_progress','finished') ) NOT NULL DEFAULT ('not_started'))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_game"("id", "status") SELECT "id", "status" FROM "game"`
    );
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`ALTER TABLE "temporary_game" RENAME TO "game"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" RENAME TO "temporary_game"`);
    await queryRunner.query(
      `CREATE TABLE "game" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( status IN ('not_started','in_progress','finished') ) NOT NULL DEFAULT ('not_started'))`
    );
    await queryRunner.query(
      `INSERT INTO "game"("id", "status") SELECT "id", "status" FROM "temporary_game"`
    );
    await queryRunner.query(`DROP TABLE "temporary_game"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "user"("id") SELECT "id" FROM "temporary_user"`
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "user"("id") SELECT "id" FROM "temporary_user"`
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`ALTER TABLE "game" RENAME TO "temporary_game"`);
    await queryRunner.query(
      `CREATE TABLE "game" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( status IN ('not_started','in_progress','finished') ) NOT NULL DEFAULT ('not_started'))`
    );
    await queryRunner.query(
      `INSERT INTO "game"("id", "status") SELECT "id", "status" FROM "temporary_game"`
    );
    await queryRunner.query(`DROP TABLE "temporary_game"`);
  }
}
