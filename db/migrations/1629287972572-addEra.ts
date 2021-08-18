import {MigrationInterface, QueryRunner} from "typeorm";

export class addEra1629287972572 implements MigrationInterface {
    name = 'addEra1629287972572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "historical_balance" ADD "era" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "historical_balance" DROP COLUMN "era"`);
    }

}
