import { MigrationInterface, QueryRunner } from "typeorm";

export class MinorEntityFieldsAddition1735721437427 implements MigrationInterface {
    name = 'MinorEntityFieldsAddition1735721437427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "followUpDate"`);
        await queryRunner.query(`CREATE TYPE "public"."call_schedule_intent_enum" AS ENUM('follow_up', 'demo', 'initial_contact', 'close_deal', 'customer_support', 'product_discovery', 'renewal_discussion', 'upsell', 'cross_sell', 'survey_feedback', 'payment_discussion', 'onboarding', 'check_in', 'event_invitation', 'partnership_discussion', 'issue_escalation', 'training_session', 'contract_negotiation', 'case_follow_up', 'other')`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD "intent" "public"."call_schedule_intent_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD "notes" text`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD "otherIntent" character varying`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD "contactContactId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD "timezone" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "outcome" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "outcome" SET DEFAULT 'neutral'`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD CONSTRAINT "FK_cb6238f1bf8cb3b6572ca9bbc7d" FOREIGN KEY ("contactContactId") REFERENCES "contacts"("contact_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP CONSTRAINT "FK_cb6238f1bf8cb3b6572ca9bbc7d"`);
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "outcome" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "outcome" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP COLUMN "contactContactId"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP COLUMN "otherIntent"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP COLUMN "notes"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP COLUMN "intent"`);
        await queryRunner.query(`DROP TYPE "public"."call_schedule_intent_enum"`);
        await queryRunner.query(`ALTER TABLE "lead" ADD "followUpDate" date`);
    }

}
