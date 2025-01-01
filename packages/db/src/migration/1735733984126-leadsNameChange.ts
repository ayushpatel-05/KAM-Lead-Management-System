import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadsNameChange1735733984126 implements MigrationInterface {
    name = 'LeadsNameChange1735733984126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_24ec9fd3dfaba2b4b00b5f8e66f"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP CONSTRAINT "FK_1767b294bc4c14a7229e8a967bb"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_52953c3fb7b0549e78330cad29c"`);
        await queryRunner.query(`CREATE TYPE "public"."leads_status_enum" AS ENUM('new', 'contacted', 'interested', 'converted', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "leads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "status" "public"."leads_status_enum" NOT NULL DEFAULT 'new', "leadSource" character varying(255) NOT NULL DEFAULT '', "notes" text, "deletedDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "keyAccountManagerId" uuid NOT NULL, "createdById" uuid NOT NULL, "restaurantId" uuid, CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_24ec9fd3dfaba2b4b00b5f8e66f" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD CONSTRAINT "FK_1767b294bc4c14a7229e8a967bb" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_52953c3fb7b0549e78330cad29c" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_2ac8607a7e1c4c14ca12e930810" FOREIGN KEY ("keyAccountManagerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_6fb5366e90bc6455ebf2f749d65" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_3ed9e8bfd9664d3635a29689f1c" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_3ed9e8bfd9664d3635a29689f1c"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_6fb5366e90bc6455ebf2f749d65"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_2ac8607a7e1c4c14ca12e930810"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_52953c3fb7b0549e78330cad29c"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP CONSTRAINT "FK_1767b294bc4c14a7229e8a967bb"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_24ec9fd3dfaba2b4b00b5f8e66f"`);
        await queryRunner.query(`DROP TABLE "leads"`);
        await queryRunner.query(`DROP TYPE "public"."leads_status_enum"`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_52953c3fb7b0549e78330cad29c" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD CONSTRAINT "FK_1767b294bc4c14a7229e8a967bb" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_24ec9fd3dfaba2b4b00b5f8e66f" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
