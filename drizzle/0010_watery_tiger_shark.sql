DROP TABLE "subscription" CASCADE;--> statement-breakpoint
ALTER TABLE "organization_customer" ADD COLUMN "subscription" jsonb;--> statement-breakpoint
ALTER TABLE "user_customer" ADD COLUMN "subscription" jsonb;