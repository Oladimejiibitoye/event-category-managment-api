import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1708793462387 implements MigrationInterface {
    name = 'Migration1708793462387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP, "deletedOn" TIMESTAMP WITH TIME ZONE, "eventName" character varying NOT NULL, CONSTRAINT "UQ_e6836f0c564aa709144353a3b87" UNIQUE ("eventName"), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "updatedOn" TIMESTAMP, "deletedOn" TIMESTAMP WITH TIME ZONE, "categoryName" character varying NOT NULL, "parentId" character varying, CONSTRAINT "UQ_cb776c7d842f8375b60273320dc" UNIQUE ("categoryName"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
