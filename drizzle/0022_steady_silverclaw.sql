ALTER TABLE "model" ADD COLUMN "input_cost" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "model" ADD COLUMN "output_cost" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "usage" ADD COLUMN "cost" integer DEFAULT 0 NOT NULL;