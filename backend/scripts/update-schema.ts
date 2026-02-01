import { AppDataSource } from '../src/data-sourse';

async function updateSchema() {
    try {
        console.log('Initializing data source...');
        await AppDataSource.initialize();
        console.log('Data source initialized');

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        console.log('Running schema updates...');

        // Create enums
        try {
            await queryRunner.query(`CREATE TYPE "public"."provider_enum" AS ENUM ('google', 'github', 'local')`);
            console.log('Created provider_enum');
        } catch (e) {
            console.log('provider_enum might already exist, skipping');
        }

        try {
            await queryRunner.query(`CREATE TYPE "public"."account_status_enum" AS ENUM ('active', 'unverified', 'suspended', 'deleted')`);
            console.log('Created account_status_enum');
        } catch (e) {
            console.log('account_status_enum might already exist, skipping');
        }

        try {
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
            console.log('Created security_event_type_enum');
        } catch (e) {
            console.log('security_event_type_enum might already exist, skipping');
        }

        // Update users table
        await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "status" "public"."account_status_enum" DEFAULT 'unverified',
      ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "suspended_at" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "suspension_reason" TEXT
    `);
        console.log('Updated users table');

        await queryRunner.query(`UPDATE "users" SET "status" = 'active' WHERE "is_verified" = true`);

        // Update user_sessions table
        await queryRunner.query(`
      ALTER TABLE "user_sessions" 
      ADD COLUMN IF NOT EXISTS "refresh_token_hash" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS "is_revoked" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "user_agent" TEXT
    `);
        console.log('Updated user_sessions table');

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
        console.log('Created security_logs table');

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
        console.log('Created oauth_providers table');

        console.log('Schema updates completed successfully');
        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
