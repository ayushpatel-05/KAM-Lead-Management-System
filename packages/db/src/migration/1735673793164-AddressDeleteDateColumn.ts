import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressDeleteDateColumn1735673793164 implements MigrationInterface {
    name = 'AddressDeleteDateColumn1735673793164'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" ADD "deletedDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "deletedDate"`);
    }

}
