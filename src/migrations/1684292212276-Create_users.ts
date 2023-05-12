import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1684292212276 implements MigrationInterface {
  name = 'CreateUsers1684292212276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "users_gender_enum" AS ENUM('Male', 'Female', 'Others')`);
    await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('User', 'Admin')`);
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying(256) NOT NULL,
        "password" character varying,
        "full_name" character varying(64) NOT NULL,
        "gender" "users_gender_enum" NOT NULL,
        "phone" character varying(16) NOT NULL,
        "address" character varying NOT NULL,
        "role" "users_role_enum" NOT NULL DEFAULT 'User',
        "avatar" character varying,
        "is_activated" boolean NOT NULL DEFAULT false,
        "activation_key" character varying,
        "reset_token" character varying,
        "reset_token_exp" TIMESTAMP,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "users_email_index" ON "users" ("email") WHERE deleted_at IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "users_email_index"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
    await queryRunner.query(`DROP TYPE "users_gender_enum"`);
  }
}
