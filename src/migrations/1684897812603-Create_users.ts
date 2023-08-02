import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1684897812603 implements MigrationInterface {
  name = 'CreateUsers1684897812603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('Male', 'Female', 'Others')`,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('User', 'Admin')`);
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying(256) NOT NULL,
        "password" character varying,
        "full_name" character varying(128),
        "gender" "public"."users_gender_enum",
        "birthday" TIMESTAMP WITH TIME ZONE,
        "phone" character varying(16),
        "address" character varying(256),
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'User',
        "avatar" character varying,
        "is_activated" boolean NOT NULL DEFAULT false,
        "activation_key" character varying,
        "activation_exp" TIMESTAMP WITH TIME ZONE,
        "reset_token" character varying,
        "reset_token_exp" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`CREATE INDEX "users_address_index" ON "users" ("address") `);
    await queryRunner.query(`CREATE INDEX "users_birthday_index" ON "users" ("birthday") `);
    await queryRunner.query(`CREATE INDEX "users_fullName_index" ON "users" ("full_name") `);
    await queryRunner.query(`CREATE INDEX "users_phone_index" ON "users" ("phone") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "users_email_index" ON "users" ("email") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."users_email_index"`);
    await queryRunner.query(`DROP INDEX "public"."users_phone_index"`);
    await queryRunner.query(`DROP INDEX "public"."users_fullName_index"`);
    await queryRunner.query(`DROP INDEX "public"."users_birthday_index"`);
    await queryRunner.query(`DROP INDEX "public"."users_address_index"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
  }
}
