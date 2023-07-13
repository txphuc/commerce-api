import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducts1688973900560 implements MigrationInterface {
  name = 'CreateProducts1688973900560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "items" (
        "id" SERIAL NOT NULL,
        "product_id" integer NOT NULL,
        "name" character varying(64) NOT NULL,
        "description" character varying(1024),
        "price" numeric(16,2) NOT NULL DEFAULT '0',
        "quantity" integer NOT NULL DEFAULT '0',
        "purchased" integer NOT NULL DEFAULT '0',
        "discount" real NOT NULL DEFAULT '0',
        "images" character varying array NOT NULL,
        "specification" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "items_pkey" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" (
        "id" SERIAL NOT NULL,
        "category_id" integer NOT NULL,
        "name" character varying(64) NOT NULL,
        "description" character varying(1024),
        "images" character varying array NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "products_pkey" PRIMARY KEY ("id")
        )`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "specification_list" character varying array`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "products_category_id_fkey"`);
    await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "items_product_id_fkey"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "specification_list"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "items"`);
  }
}
