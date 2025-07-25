CREATE TABLE "usage" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"credits" integer DEFAULT 0 NOT NULL,
	"search" integer DEFAULT 0 NOT NULL,
	"research" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usage" ADD CONSTRAINT "usage_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;