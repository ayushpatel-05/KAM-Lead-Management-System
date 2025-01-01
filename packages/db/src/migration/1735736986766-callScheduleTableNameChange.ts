import { MigrationInterface, QueryRunner } from "typeorm";

export class CallScheduleTableNameChange1735736986766 implements MigrationInterface {
    name = 'CallScheduleTableNameChange1735736986766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."call_schedules_type_enum" AS ENUM('fixed', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."call_schedules_status_enum" AS ENUM('scheduled', 'completed', 'missed')`);
        await queryRunner.query(`CREATE TYPE "public"."call_schedules_intent_enum" AS ENUM('follow_up', 'demo', 'initial_contact', 'close_deal', 'customer_support', 'product_discovery', 'renewal_discussion', 'upsell', 'cross_sell', 'survey_feedback', 'payment_discussion', 'onboarding', 'check_in', 'event_invitation', 'partnership_discussion', 'issue_escalation', 'training_session', 'contract_negotiation', 'case_follow_up', 'other')`);
        await queryRunner.query(`CREATE TABLE "call_schedules" ("id" SERIAL NOT NULL, "type" "public"."call_schedules_type_enum" NOT NULL DEFAULT 'fixed', "datetime" TIMESTAMP NOT NULL, "status" "public"."call_schedules_status_enum" NOT NULL DEFAULT 'scheduled', "intent" "public"."call_schedules_intent_enum" NOT NULL, "notes" text, "otherIntent" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "leadId" uuid NOT NULL, "contactId" uuid NOT NULL, CONSTRAINT "PK_acc988773d3f4b36c6757c87a89" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "call_schedules" ADD CONSTRAINT "FK_49f4e8ed70759620c6c2657cf7b" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_schedules" ADD CONSTRAINT "FK_237379218090f4fcdb444dc5c3e" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_schedules" DROP CONSTRAINT "FK_237379218090f4fcdb444dc5c3e"`);
        await queryRunner.query(`ALTER TABLE "call_schedules" DROP CONSTRAINT "FK_49f4e8ed70759620c6c2657cf7b"`);
        await queryRunner.query(`DROP TABLE "call_schedules"`);
        await queryRunner.query(`DROP TYPE "public"."call_schedules_intent_enum"`);
        await queryRunner.query(`DROP TYPE "public"."call_schedules_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."call_schedules_type_enum"`);
    }

}
