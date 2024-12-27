import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadEntity1735330058593 implements MigrationInterface {
    name = 'LeadEntity1735330058593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lead_status_enum" AS ENUM('new', 'contacted', 'interested', 'converted', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "lead" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "status" "public"."lead_status_enum" NOT NULL DEFAULT 'new', "leadSource" character varying(255) NOT NULL DEFAULT '', "notes" text, "followUpDate" date, "deletedDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "keyAccountManagerId" uuid NOT NULL, "createdById" uuid NOT NULL, "restaurantId" uuid, CONSTRAINT "PK_ca96c1888f7dcfccab72b72fffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_fea16e86b498c846aba86a64d7e" FOREIGN KEY ("keyAccountManagerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_2d935a9512fa1d80d231c01ce97" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_d17dfcf37aa24d8312aee296a81" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_d17dfcf37aa24d8312aee296a81"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_2d935a9512fa1d80d231c01ce97"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_fea16e86b498c846aba86a64d7e"`);
        await queryRunner.query(`DROP TABLE "lead"`);
        await queryRunner.query(`DROP TYPE "public"."lead_status_enum"`);
    }

}
