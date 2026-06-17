-- Custom SQL migration file, put your code below! --

-- Correct model capabilities against models.dev (modalities.input image=vision,
-- pdf=documents; tool_call=tools; reasoning). Removes vision/documents wrongly
-- claimed by text-only models and fixes a few missing tools/reasoning flags.

-- alibaba/qwen3.7-max: tools,reasoning,documents -> tools,reasoning
UPDATE "model" SET "capabilities" = '["tools", "reasoning"]', "updated_at" = NOW() WHERE "id" = 'qwen3.7-max';
-- deepseek/deepseek-v4-flash: tools,reasoning,vision,documents -> tools,reasoning
UPDATE "model" SET "capabilities" = '["tools", "reasoning"]', "updated_at" = NOW() WHERE "id" = 'deepseek-v4-flash';
-- deepseek/deepseek-v4-pro: tools,reasoning,documents -> tools,reasoning
UPDATE "model" SET "capabilities" = '["tools", "reasoning"]', "updated_at" = NOW() WHERE "id" = 'deepseek-v4-pro';
-- mistral/magistral-medium: reasoning,vision -> tools,reasoning
UPDATE "model" SET "capabilities" = '["tools", "reasoning"]', "updated_at" = NOW() WHERE "id" = 'magistral-medium';
-- moonshotai/kimi-k2.6: tools,reasoning,vision,documents -> tools,reasoning,vision
UPDATE "model" SET "capabilities" = '["tools", "reasoning", "vision"]', "updated_at" = NOW() WHERE "id" = 'kimi-k2.6';
-- moonshotai/kimi-k2.7-code: tools,reasoning,vision,documents -> tools,reasoning,vision
UPDATE "model" SET "capabilities" = '["tools", "reasoning", "vision"]', "updated_at" = NOW() WHERE "id" = 'kimi-k2.7-code';
-- zai/glm-4.5-air: tools -> tools,reasoning
UPDATE "model" SET "capabilities" = '["tools", "reasoning"]', "updated_at" = NOW() WHERE "id" = 'glm-4.5-air';
-- zai/glm-4.6: tools,reasoning,vision -> tools,reasoning
UPDATE "model" SET "capabilities" = '["tools", "reasoning"]', "updated_at" = NOW() WHERE "id" = 'glm-4.6';
-- zai/glm-5.1: tools,reasoning,vision,documents -> tools,reasoning
UPDATE "model" SET "capabilities" = '["tools", "reasoning"]', "updated_at" = NOW() WHERE "id" = 'glm-5.1';
-- zai/glm-5.2: tools,reasoning,vision,documents -> tools,reasoning
UPDATE "model" SET "capabilities" = '["tools", "reasoning"]', "updated_at" = NOW() WHERE "id" = 'glm-5.2';
-- mistral/mistral-large-3: vision -> tools,vision (via mistral-large-latest)
UPDATE "model" SET "capabilities" = '["tools", "vision"]', "updated_at" = NOW() WHERE "id" = 'mistral-large-3';
