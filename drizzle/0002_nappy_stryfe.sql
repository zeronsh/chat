CREATE TYPE "public"."mode" AS ENUM('light', 'dark');--> statement-breakpoint
CREATE TABLE "setting" (
	"id" text PRIMARY KEY NOT NULL,
	"mode" "mode" DEFAULT 'dark' NOT NULL,
	"theme" text,
	"user_id" text NOT NULL,
	"nickname" text,
	"biography" text,
	"instructions" text,
	"model_id" text DEFAULT 'gpt-4o-mini' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "setting" ADD CONSTRAINT "setting_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;