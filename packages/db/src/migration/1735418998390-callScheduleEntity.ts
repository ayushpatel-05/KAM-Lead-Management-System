import { MigrationInterface, QueryRunner } from "typeorm";

export class CallScheduleEntity1735418998390 implements MigrationInterface {
    name = 'CallScheduleEntity1735418998390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."call_schedule_type_enum" AS ENUM('fixed', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."call_schedule_status_enum" AS ENUM('scheduled', 'completed', 'missed')`);
        await queryRunner.query(`CREATE TABLE "call_schedule" ("id" SERIAL NOT NULL, "type" "public"."call_schedule_type_enum" NOT NULL DEFAULT 'fixed', "datetime" TIMESTAMP NOT NULL, "status" "public"."call_schedule_status_enum" NOT NULL DEFAULT 'scheduled', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "leadId" uuid NOT NULL, CONSTRAINT "PK_71e30acda3fd49136b817df3bd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD CONSTRAINT "FK_1767b294bc4c14a7229e8a967bb" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP CONSTRAINT "FK_1767b294bc4c14a7229e8a967bb"`);
        await queryRunner.query(`DROP TABLE "call_schedule"`);
        await queryRunner.query(`DROP TYPE "public"."call_schedule_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."call_schedule_type_enum"`);
    }

}
