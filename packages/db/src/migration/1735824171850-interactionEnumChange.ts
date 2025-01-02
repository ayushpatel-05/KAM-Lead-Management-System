import { MigrationInterface, QueryRunner } from "typeorm";

export class InteractionEnumChange1735824171850 implements MigrationInterface {
    name = 'InteractionEnumChange1735824171850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."interactions_interactionsubtype_enum" RENAME TO "interactions_interactionsubtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."interactions_interactionsubtype_enum" AS ENUM('initial', 'follow-up', 'feedback', 'new_order', 'repeat_order')`);
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "interactionSubtype" TYPE "public"."interactions_interactionsubtype_enum" USING "interactionSubtype"::"text"::"public"."interactions_interactionsubtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_interactionsubtype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."interactions_interactionsubtype_enum_old" AS ENUM('initial', 'follow-up', 'feedback', 'new order', 'repeat order')`);
        await queryRunner.query(`ALTER TABLE "interactions" ALTER COLUMN "interactionSubtype" TYPE "public"."interactions_interactionsubtype_enum_old" USING "interactionSubtype"::"text"::"public"."interactions_interactionsubtype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."interactions_interactionsubtype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."interactions_interactionsubtype_enum_old" RENAME TO "interactions_interactionsubtype_enum"`);
    }

}
