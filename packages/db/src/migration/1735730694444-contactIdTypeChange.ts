import { MigrationInterface, QueryRunner } from "typeorm";

export class ContactIdTypeChange1735730694444 implements MigrationInterface {
    name = 'ContactIdTypeChange1735730694444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_7b7868e27707ff083e9d7895a11"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP CONSTRAINT "FK_cb6238f1bf8cb3b6572ca9bbc7d"`);
        await queryRunner.query(`ALTER TABLE "interactions" RENAME COLUMN "contactContactId" TO "contactId"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" RENAME COLUMN "contactContactId" TO "contactId"`);
        await queryRunner.query(`ALTER TABLE "contacts" RENAME COLUMN "contact_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "contacts" RENAME CONSTRAINT "PK_b85c417d6af2e06ff6ba8c8234d" TO "PK_b99cd40cfd66a99f1571f4f72e6"`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_4bd626c3d2b2a872af396904bd3" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD CONSTRAINT "FK_facbc68b1505eb06c26d7606e92" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_schedule" DROP CONSTRAINT "FK_facbc68b1505eb06c26d7606e92"`);
        await queryRunner.query(`ALTER TABLE "interactions" DROP CONSTRAINT "FK_4bd626c3d2b2a872af396904bd3"`);
        await queryRunner.query(`ALTER TABLE "contacts" RENAME CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" TO "PK_b85c417d6af2e06ff6ba8c8234d"`);
        await queryRunner.query(`ALTER TABLE "contacts" RENAME COLUMN "id" TO "contact_id"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" RENAME COLUMN "contactId" TO "contactContactId"`);
        await queryRunner.query(`ALTER TABLE "interactions" RENAME COLUMN "contactId" TO "contactContactId"`);
        await queryRunner.query(`ALTER TABLE "call_schedule" ADD CONSTRAINT "FK_cb6238f1bf8cb3b6572ca9bbc7d" FOREIGN KEY ("contactContactId") REFERENCES "contacts"("contact_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interactions" ADD CONSTRAINT "FK_7b7868e27707ff083e9d7895a11" FOREIGN KEY ("contactContactId") REFERENCES "contacts"("contact_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
