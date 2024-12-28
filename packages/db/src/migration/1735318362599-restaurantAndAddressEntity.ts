import { MigrationInterface, QueryRunner } from "typeorm";

export class RestaurantAndAddressEntity1735318362599 implements MigrationInterface {
    name = 'RestaurantAndAddressEntity1735318362599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "addressLine1" text, "city" character varying(100), "state" character varying(100), "country" character varying(100), "zipCode" character varying(20), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "deletedDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addressId" uuid, "userId" uuid, CONSTRAINT "REL_6ed5e37a5a3021bd177acb48ca" UNIQUE ("addressId"), CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "FK_6ed5e37a5a3021bd177acb48ca5" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "FK_a6d82a35be7467761ee3a1a309e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "FK_a6d82a35be7467761ee3a1a309e"`);
        await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "FK_6ed5e37a5a3021bd177acb48ca5"`);
        await queryRunner.query(`DROP TABLE "restaurants"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
