import {MigrationInterface, QueryRunner} from "typeorm";

export class database1712760231191 implements MigrationInterface {
    name = 'database1712760231191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cron-history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "job_name" "public"."cron-history_job_name_enum" NOT NULL, "total_record" integer NOT NULL, "status" "public"."cron-history_status_enum" NOT NULL DEFAULT '1', CONSTRAINT "PK_bf7a667711a4eab0642de0bfc4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cron-logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "message" character varying NOT NULL, "action" integer NOT NULL, "is_error" boolean NOT NULL, "cron_history_id" uuid, "booking_id" uuid, CONSTRAINT "PK_2b983be370e25fe267e51a17333" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "event_id" character varying, "summary" character varying(255), "description" text, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "email" character varying NOT NULL, "user_name" character varying NOT NULL, "color" character varying, "time_zone" character varying NOT NULL, "status" "public"."booking_status_enum" NOT NULL DEFAULT '1', "location" character varying NOT NULL, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_deleted" boolean NOT NULL DEFAULT false, "user_name" character varying NOT NULL, "pass_word" character varying NOT NULL, "email" character varying NOT NULL, "color" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cron-logs" ADD CONSTRAINT "FK_942351baead0bd9c3b9c27f4e47" FOREIGN KEY ("cron_history_id") REFERENCES "cron-history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cron-logs" ADD CONSTRAINT "FK_5ec8010b412ac8759c64a9c5c2a" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cron-logs" DROP CONSTRAINT "FK_5ec8010b412ac8759c64a9c5c2a"`);
        await queryRunner.query(`ALTER TABLE "cron-logs" DROP CONSTRAINT "FK_942351baead0bd9c3b9c27f4e47"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "cron-logs"`);
        await queryRunner.query(`DROP TABLE "cron-history"`);
    }

}
