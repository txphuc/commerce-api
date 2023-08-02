import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1689751790360 implements MigrationInterface {
  name = 'CreateOrders1689751790360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_method" (
        "id" SERIAL NOT NULL,
        "name" character varying(64) NOT NULL,
        "description" character varying(1024),
        "account_number" character varying(20),
        "account_owner" character varying(64),
        "qr_code" character varying(256),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "payment_methods_name_index" ON "payment_method" ("name") WHERE deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('Unconfirmed',
      'Canceled',
      'Confirmed',
      'Preparing',
      'Delivering',
      'Completed'
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "is_paid" boolean NOT NULL DEFAULT false,
        "payment_method_id" integer NOT NULL,
        "status" "public"."orders_status_enum" NOT NULL DEFAULT 'Unconfirmed',
        "canceled_date_time" TIMESTAMP WITH TIME ZONE,
        "confirmed_date_time" TIMESTAMP WITH TIME ZONE,
        "start_delivering_date_time" TIMESTAMP WITH TIME ZONE,
        "completed_date_time" TIMESTAMP WITH TIME ZONE,
        "planned_delivery_date" TIMESTAMP WITH TIME ZONE,
        "receiver" character varying(64) NOT NULL,
        "address" character varying(256) NOT NULL,
        "phone" character varying(16) NOT NULL,
        "delivery_fee" numeric(16,2) NOT NULL DEFAULT '0',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" (
        "id" SERIAL NOT NULL,
        "order_id" integer NOT NULL,
        "item_id" integer NOT NULL,
        "quantity" integer NOT NULL DEFAULT '1',
        "original_amount" numeric(16,2) NOT NULL DEFAULT '0',
        "actual_amount" numeric(16,2) NOT NULL DEFAULT '0',
        "comment" character varying(1024),
        "images" character varying array,
        "rating" smallint,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`CREATE INDEX "item_id_index" ON "order_items" ("item_id") `);
    await queryRunner.query(`CREATE INDEX "order_id_index" ON "order_items" ("order_id") `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "order_id_item_id_unique_index" ON "order_items" ("order_id",
      "item_id") `,
    );
    await queryRunner.query(`DROP INDEX "public"."users_address_index"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying(256)`);
    await queryRunner.query(`CREATE INDEX "users_address_index" ON "users" ("address") `);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "order_items_ item_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "order_items_ order_id_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_method_id_fkey"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey"`);
    await queryRunner.query(`DROP INDEX "public"."users_address_index"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying`);
    await queryRunner.query(`CREATE INDEX "users_address_index" ON "users" ("address") `);
    await queryRunner.query(`DROP INDEX "public"."order_id_item_id_unique_index"`);
    await queryRunner.query(`DROP INDEX "public"."order_id_index"`);
    await queryRunner.query(`DROP INDEX "public"."item_id_index"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."payment_methods_name_index"`);
    await queryRunner.query(`DROP TABLE "payment_method"`);
  }
}
