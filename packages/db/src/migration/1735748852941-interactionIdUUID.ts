import { MigrationInterface, QueryRunner } from "typeorm";

export class InteractionIdUUID1735748852941 implements MigrationInterface {
    name = 'InteractionIdUUID1735748852941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_schedules" DROP CONSTRAINT "PK_acc988773d3f4b36c6757c87a89"`);
        await queryRunner.query(`ALTER TABLE "call_schedules" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "call_schedules" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "call_schedules" ADD CONSTRAINT "PK_acc988773d3f4b36c6757c87a89" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_schedules" DROP CONSTRAINT "PK_acc988773d3f4b36c6757c87a89"`);
        await queryRunner.query(`ALTER TABLE "call_schedules" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "call_schedules" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "call_schedules" ADD CONSTRAINT "PK_acc988773d3f4b36c6757c87a89" PRIMARY KEY ("id")`);
    }

}
