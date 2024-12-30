import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntityPasswordCol1735561685935 implements MigrationInterface {
    name = 'UserEntityPasswordCol1735561685935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
