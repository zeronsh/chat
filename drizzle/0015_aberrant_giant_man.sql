ALTER TABLE "setting" ALTER COLUMN "pinned_models" SET DEFAULT '["claude-4-sonnet","gpt-4o","gpt-4o-mini","gemini-2.5-flash","gemini-2.5-pro","gemini-2.0-flash","kimi-k2"]'::jsonb;--> statement-breakpoint
CREATE INDEX "message_thread_id_index" ON "message" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "message_user_id_index" ON "message" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "setting_user_id_index" ON "setting" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "thread_user_id_index" ON "thread" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_user_id_index" ON "usage" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_customer_user_id_index" ON "user_customer" USING btree ("user_id");