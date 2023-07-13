import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategories1687233362544 implements MigrationInterface {
  name = 'CreateCategories1687233362544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" (
        "id" SERIAL NOT NULL,
        "name" character varying(64) NOT NULL,
        "description" character varying(1024),
        "parent_id" integer,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "categories_name_index" ON "categories" ("name") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "categories_category_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "categories_category_id_fkey"`,
    );
    await queryRunner.query(`DROP INDEX "public"."categories_name_index"`);
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
