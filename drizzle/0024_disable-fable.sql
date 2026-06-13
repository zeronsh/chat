-- Custom SQL migration file, put your code below! --

-- Claude Fable 5 is no longer available — hide it from selection. The row
-- stays so existing threads/settings that reference it don't break.
UPDATE "model"
SET "enabled" = false, "updated_at" = NOW()
WHERE "id" = 'claude-fable-5';--> statement-breakpoint

-- Move anyone whose selected model was Fable back to the default model.
UPDATE "setting"
SET "model_id" = 'gpt-4o-mini'
WHERE "model_id" = 'claude-fable-5';
