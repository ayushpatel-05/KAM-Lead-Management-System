import { MigrationInterface, QueryRunner } from "typeorm";

export class ContactEntity1735332403340 implements MigrationInterface {
    name = 'ContactEntity1735332403340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contacts" ("contact_id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "role" character varying(100), "phone" character varying(20), "email" character varying(255), "notes" text, "deletedDate" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "leadId" uuid, CONSTRAINT "UQ_752866c5247ddd34fd05559537d" UNIQUE ("email"), CONSTRAINT "PK_b85c417d6af2e06ff6ba8c8234d" PRIMARY KEY ("contact_id"))`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_52953c3fb7b0549e78330cad29c" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_52953c3fb7b0549e78330cad29c"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
    }

}
