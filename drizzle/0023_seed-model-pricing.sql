-- Custom SQL migration file, put your code below! --

-- Populate per-model gateway pricing, in micro-dollars per million tokens
-- (Vercel AI Gateway $/token * 1e12), as of June 12, 2026.
UPDATE "model" SET "input_cost" = 2500000, "output_cost" = 10000000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-4o';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 150000, "output_cost" = 600000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-4o-mini';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1250000, "output_cost" = 10000000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-5';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 250000, "output_cost" = 2000000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-5-mini';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 50000, "output_cost" = 400000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-5-nano';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 350000, "output_cost" = 750000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-oss-120b';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 50000, "output_cost" = 200000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-oss-20b';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 5000000, "output_cost" = 30000000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-5.5';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 30000000, "output_cost" = 180000000, "updated_at" = NOW() WHERE "model" = 'openai/gpt-5.5-pro';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 300000, "output_cost" = 2500000, "updated_at" = NOW() WHERE "model" = 'google/gemini-2.5-flash';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1250000, "output_cost" = 10000000, "updated_at" = NOW() WHERE "model" = 'google/gemini-2.5-pro';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 2000000, "output_cost" = 12000000, "updated_at" = NOW() WHERE "model" = 'google/gemini-3-pro-preview';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1500000, "output_cost" = 9000000, "updated_at" = NOW() WHERE "model" = 'google/gemini-3.5-flash';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 2000000, "output_cost" = 12000000, "updated_at" = NOW() WHERE "model" = 'google/gemini-3.1-pro-preview';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1250000, "output_cost" = 2500000, "updated_at" = NOW() WHERE "model" = 'xai/grok-4.3';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 200000, "output_cost" = 500000, "updated_at" = NOW() WHERE "model" = 'xai/grok-4.1-fast-non-reasoning';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 570000, "output_cost" = 2300000, "updated_at" = NOW() WHERE "model" = 'moonshotai/kimi-k2';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 600000, "output_cost" = 2500000, "updated_at" = NOW() WHERE "model" = 'moonshotai/kimi-k2-thinking';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 950000, "output_cost" = 4000000, "updated_at" = NOW() WHERE "model" = 'moonshotai/kimi-k2.6';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 3000000, "output_cost" = 15000000, "updated_at" = NOW() WHERE "model" = 'anthropic/claude-sonnet-4.5';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1000000, "output_cost" = 5000000, "updated_at" = NOW() WHERE "model" = 'anthropic/claude-haiku-4.5';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 10000000, "output_cost" = 50000000, "updated_at" = NOW() WHERE "model" = 'anthropic/claude-fable-5';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 5000000, "output_cost" = 25000000, "updated_at" = NOW() WHERE "model" = 'anthropic/claude-opus-4.8';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 3000000, "output_cost" = 15000000, "updated_at" = NOW() WHERE "model" = 'anthropic/claude-sonnet-4.6';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1350000, "output_cost" = 5400000, "updated_at" = NOW() WHERE "model" = 'deepseek/deepseek-r1';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 270000, "output_cost" = 1120000, "updated_at" = NOW() WHERE "model" = 'deepseek/deepseek-v3';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 560000, "output_cost" = 1680000, "updated_at" = NOW() WHERE "model" = 'deepseek/deepseek-v3.1';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 435000, "output_cost" = 870000, "updated_at" = NOW() WHERE "model" = 'deepseek/deepseek-v4-pro';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 140000, "output_cost" = 280000, "updated_at" = NOW() WHERE "model" = 'deepseek/deepseek-v4-flash';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 600000, "output_cost" = 2200000, "updated_at" = NOW() WHERE "model" = 'zai/glm-4.5';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 200000, "output_cost" = 1100000, "updated_at" = NOW() WHERE "model" = 'zai/glm-4.5-air';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 600000, "output_cost" = 1800000, "updated_at" = NOW() WHERE "model" = 'zai/glm-4.5v';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 600000, "output_cost" = 2200000, "updated_at" = NOW() WHERE "model" = 'zai/glm-4.6';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1400000, "output_cost" = 4400000, "updated_at" = NOW() WHERE "model" = 'zai/glm-5.1';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1500000, "output_cost" = 7500000, "updated_at" = NOW() WHERE "model" = 'alibaba/qwen3-coder';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1200000, "output_cost" = 6000000, "updated_at" = NOW() WHERE "model" = 'alibaba/qwen3-max';--> statement-breakpoint
UPDATE "model" SET "input_cost" = 1250000, "output_cost" = 3750000, "updated_at" = NOW() WHERE "model" = 'alibaba/qwen3.7-max';
