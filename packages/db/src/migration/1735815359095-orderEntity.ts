import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderEntity1735815359095 implements MigrationInterface {
    name = 'OrderEntity1735815359095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalAmount" numeric(10,2) NOT NULL, "notes" text, "orderDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "leadId" uuid NOT NULL, "userId" uuid NOT NULL, "interactionId" uuid, CONSTRAINT "REL_e9283024ebd0126796f7d70cf4" UNIQUE ("interactionId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP COLUMN "orderAmount"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f68574c94d0833ec7c759bedb85" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_e9283024ebd0126796f7d70cf4e" FOREIGN KEY ("interactionId") REFERENCES "interactions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_e9283024ebd0126796f7d70cf4e"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f68574c94d0833ec7c759bedb85"`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD "orderAmount" numeric(10,2)`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
