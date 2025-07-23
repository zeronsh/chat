CREATE TABLE "organization_customer" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	CONSTRAINT "organization_customer_id_unique" UNIQUE("id"),
	CONSTRAINT "organization_customer_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT "subscription_customer_id_unique" UNIQUE("customer_id")
);
--> statement-breakpoint
CREATE TABLE "user_customer" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "user_customer_id_unique" UNIQUE("id"),
	CONSTRAINT "user_customer_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "organization_customer" ADD CONSTRAINT "organization_customer_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_customer" ADD CONSTRAINT "user_customer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;