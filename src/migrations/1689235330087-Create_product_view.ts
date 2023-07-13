import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductView1689235330087 implements MigrationInterface {
  name = 'CreateProductView1689235330087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE VIEW "product_view" AS SELECT "product"."id" AS "product_id", MIN("item"."price") AS "min_price", MAX("item"."price") AS "max_price", MIN("item"."discount") AS "min_discount", MAX("item"."discount") AS "max_discount", SUM("item"."quantity") AS "total_quantity", SUM("item"."purchased") AS "total_purchased" FROM "products" "product" LEFT JOIN "items" "item" ON "item"."product_id"="product"."id" AND ("item"."deleted_at" IS NULL) WHERE ( "product"."deleted_at" is null and "item"."deleted_at" is null ) AND ( "product"."deleted_at" IS NULL ) GROUP BY "product"."id"`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'product_view',
        'SELECT "product"."id" AS "product_id", MIN("item"."price") AS "min_price", MAX("item"."price") AS "max_price", MIN("item"."discount") AS "min_discount", MAX("item"."discount") AS "max_discount", SUM("item"."quantity") AS "total_quantity", SUM("item"."purchased") AS "total_purchased" FROM "products" "product" LEFT JOIN "items" "item" ON "item"."product_id"="product"."id" AND ("item"."deleted_at" IS NULL) WHERE ( "product"."deleted_at" is null and "item"."deleted_at" is null ) AND ( "product"."deleted_at" IS NULL ) GROUP BY "product"."id"',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'product_view', 'public'],
    );
    await queryRunner.query(`DROP VIEW "product_view"`);
  }
}
