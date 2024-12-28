import { MigrationInterface, QueryRunner } from "typeorm";

export class InteractionEntity1735411905011 implements MigrationInterface {
    name = 'InteractionEntity1735411905011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."interactions_interactiontype_enum" AS ENUM('call', 'order')`);
        await queryRunner.query(`CREATE TYPE "public"."interactions_interactionsubtype_enum" AS ENUM('initial', 'follow-up', 'feedback', 'new order', 'repeat order')`);
        await queryRunner.query(`CREATE TYPE "public"."interactions_interactionmethod_enum" AS ENUM('phone', 'email', 'chat', 'in-person')`);
        await queryRunner.query(`CREATE TYPE "public"."interactions_outcome_enum" AS ENUM('positive', 'neutral', 'negative')`);
        await queryRunner.query(`CREATE TABLE "interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "interactionType" "public"."interactions_interactiontype_enum" NOT NULL, "interactionSubtype" "public"."interactions_interactionsubtype_enum", "interactionMethod" "public"."interactions_interactionmethod_enum" NOT NULL, "callDuration" integer, "orderAmount" numeric(10,2), "details" text, "interactionDate" TIMESTAMP NOT NULL, "outcome" "public"."interactions_outcome_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "userId" uuid NOT NULL, "leadId" uuid NOT NULL, "contactContactId" uuid NOT NULL, CONSTRAINT "PK_911b7416a6671b4148b18c18ecb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "PK_b85c417d6af2e06ff6ba8c8234d"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "contact_id"`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD "contact_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "PK_b85c417d6af2e06ff6ba8c8234d" PRIMARY KEY ("contact_id")`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_9992157cbe54583ff7002ae4c00" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_24ec9fd3dfaba2b4b00b5f8e66f" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_7b7868e27707ff083e9d7895a11" FOREIGN KEY ("contactContactId") REFERENCES "contacts"("contact_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_7b7868e27707ff083e9d7895a11"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_24ec9fd3dfaba2b4b00b5f8e66f"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_9992157cbe54583ff7002ae4c00"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "PK_b85c417d6af2e06ff6ba8c8234d"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "contact_id"`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD "contact_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "PK_b85c417d6af2e06ff6ba8c8234d" PRIMARY KEY ("contact_id")`);
        await queryRunner.query(`DROP TABLE "interactions"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_outcome_enum"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_interactionmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_interactionsubtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_interactiontype_enum"`);
    }

}
