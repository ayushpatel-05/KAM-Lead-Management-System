import { MigrationInterface, QueryRunner } from "typeorm";

export class RestaurantEntityUserRequired1735663987644 implements MigrationInterface {
    name = 'RestaurantEntityUserRequired1735663987644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "FK_a6d82a35be7467761ee3a1a309e"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "FK_a6d82a35be7467761ee3a1a309e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurants" DROP CONSTRAINT "FK_a6d82a35be7467761ee3a1a309e"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurants" ADD CONSTRAINT "FK_a6d82a35be7467761ee3a1a309e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
