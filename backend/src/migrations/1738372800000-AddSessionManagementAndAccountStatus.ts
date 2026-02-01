import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionManagementAndAccountStatus1738372800000 implements MigrationInterface {
    name = 'AddSessionManagementAndAccountStatus1738372800000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create account_status enum
        await queryRunner.query(`
      CREATE TYPE "public"."account_status_enum" AS ENUM ('active', 'unverified', 'suspended', 'deleted')
    `);

        // Create security_event_type enum
        await queryRunner.query(`
      CREATE TYPE "public"."security_event_type_enum" AS ENUM (
        'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'LOGOUT_ALL',
        'PASSWORD_CHANGE', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS',
        'EMAIL_VERIFICATION_SENT', 'EMAIL_VERIFIED',
        'SESSION_CREATED', 'SESSION_REVOKED', 'SESSION_EXPIRED', 'TOKEN_REFRESHED',
        'OAUTH_LINK', 'OAUTH_UNLINK',
        'ACCOUNT_SUSPENDED', 'ACCOUNT_DELETED', 'ACCOUNT_RESTORED',
        'NEW_DEVICE_LOGIN', 'SUSPICIOUS_ACTIVITY'
      )
    `);

        // Add new columns to users table
        await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "status" "public"."account_status_enum" DEFAULT 'unverified',
      ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "suspended_at" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "suspension_reason" TEXT
    `);

        // Update existing verified users to 'active' status
        await queryRunner.query(`
      UPDATE "users" SET "status" = 'active' WHERE "is_verified" = true
    `);

        // Add index on status
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_status" ON "users" ("status")
    `);

        // Add new columns to user_sessions table
        await queryRunner.query(`
      ALTER TABLE "user_sessions" 
      ADD COLUMN IF NOT EXISTS "refresh_token_hash" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "is_revoked" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "user_agent" TEXT
    `);

        // Set default values for existing sessions (mark as revoked since they're legacy)
        await queryRunner.query(`
      UPDATE "user_sessions" 
      SET "is_revoked" = true,
          "expires_at" = NOW()
      WHERE "refresh_token_hash" IS NULL
    `);

        // Add index on userId and isRevoked
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_sessions_user_revoked" ON "user_sessions" ("user_id", "is_revoked")
    `);

        // Create security_logs table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "security_logs" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID REFERENCES "users"("uuid") ON DELETE SET NULL,
        "event_type" "public"."security_event_type_enum" NOT NULL,
        "ip_address" VARCHAR(45),
        "user_agent" TEXT,
        "metadata" JSONB DEFAULT '{}',
        "session_id" UUID,
        "success" BOOLEAN DEFAULT true,
        "error_message" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

        // Add indexes for security_logs
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_security_logs_user_event" ON "security_logs" ("user_id", "event_type")
    `);
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_security_logs_created" ON "security_logs" ("created_at")
    `);

        // Create oauth_providers table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "oauth_providers" (
        "uuid" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL REFERENCES "users"("uuid") ON DELETE CASCADE,
        "provider" "public"."provider_enum" NOT NULL,
        "provider_id" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255),
        "display_name" VARCHAR(255),
        "avatar_url" VARCHAR(500),
        "profile_data" JSONB DEFAULT '{}',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE("user_id", "provider")
      )
    `);

        // Add index for oauth_providers
        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_oauth_providers_provider_id" ON "oauth_providers" ("provider", "provider_id")
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop oauth_providers table
        await queryRunner.query(`DROP TABLE IF EXISTS "oauth_providers"`);

        // Drop security_logs table
        await queryRunner.query(`DROP TABLE IF EXISTS "security_logs"`);

        // Remove new columns from user_sessions
        await queryRunner.query(`
      ALTER TABLE "user_sessions" 
      DROP COLUMN IF EXISTS "refresh_token_hash",
      DROP COLUMN IF EXISTS "expires_at",
      DROP COLUMN IF EXISTS "is_revoked",
      DROP COLUMN IF EXISTS "user_agent"
    `);

        // Drop index on user_sessions
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_sessions_user_revoked"`);

        // Remove new columns from users
        await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN IF EXISTS "status",
      DROP COLUMN IF EXISTS "deleted_at",
      DROP COLUMN IF EXISTS "suspended_at",
      DROP COLUMN IF EXISTS "suspension_reason"
    `);

        // Drop index on users
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_status"`);

        // Drop enums
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."security_event_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."account_status_enum"`);
    }
}
