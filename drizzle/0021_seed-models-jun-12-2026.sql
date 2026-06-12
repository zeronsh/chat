-- Custom SQL migration file, put your code below! --

-- Disable models that are no longer available on the Vercel AI Gateway.
-- Rows are kept (threads/settings reference them); they are only hidden from selection.
UPDATE "model"
SET "enabled" = false, "updated_at" = NOW()
WHERE "id" IN (
    'gemini-2.0-flash',
    'claude-4-sonnet',
    'grok-3',
    'grok-3-mini',
    'grok-4',
    'grok-4-fast',
    'grok-code-fast-1',
    'kimi-k2-0905',
    'deepseek-r1-distill-llama-70b'
);--> statement-breakpoint

-- Seed new flagship models available on the Vercel AI Gateway.
INSERT INTO "model" (
    "id",
    "name",
    "model",
    "description",
    "capabilities",
    "icon",
    "access",
    "credits",
    "created_at",
    "updated_at"
)
VALUES

(
    'claude-fable-5', -- id
    'Claude Fable 5', -- name
    'anthropic/claude-fable-5', -- model
    'The first model in Anthropic''s Claude 5 family and their most intelligent model to date. Part of the new Mythos-class tier above Opus, it excels at deep reasoning, long-horizon agentic work, and complex coding tasks with a 1M token context window', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'anthropic', -- icon
    'premium_required', -- access
    10, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'claude-4.8-opus', -- id
    'Claude Opus 4.8', -- name
    'anthropic/claude-opus-4.8', -- model
    'Anthropic''s flagship Opus model, delivering frontier performance on coding, agentic workflows, and sustained multi-step reasoning with a 1M token context window', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'anthropic', -- icon
    'premium_required', -- access
    8, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'claude-4.6-sonnet', -- id
    'Claude Sonnet 4.6', -- name
    'anthropic/claude-sonnet-4.6', -- model
    'The latest Claude Sonnet, balancing frontier intelligence with speed and cost. A strong default for everyday coding, reasoning, and agentic tasks', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'anthropic', -- icon
    'premium_required', -- access
    5, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gpt-5.5', -- id
    'GPT 5.5', -- name
    'openai/gpt-5.5', -- model
    'OpenAI''s flagship model with improved reasoning, multimodal understanding, and agentic tool use over the GPT 5 series', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'openai', -- icon
    'premium_required', -- access
    8, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gpt-5.5-pro', -- id
    'GPT 5.5 Pro', -- name
    'openai/gpt-5.5-pro', -- model
    'OpenAI''s most capable model, using extended compute for the hardest reasoning, research, and coding problems', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'openai', -- icon
    'premium_required', -- access
    20, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'deepseek-v4-pro', -- id
    'DeepSeek V4 Pro', -- name
    'deepseek/deepseek-v4-pro', -- model
    'DeepSeek''s flagship model with strong reasoning, coding, and tool use performance at an exceptional price', -- description
    '["tools", "reasoning", "documents"]', -- capabilities
    'deepseek', -- icon
    'account_required', -- access
    2, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'deepseek-v4-flash', -- id
    'DeepSeek V4 Flash', -- name
    'deepseek/deepseek-v4-flash', -- model
    'A fast, lightweight version of DeepSeek V4 with vision support, optimized for low-latency, high-volume tasks', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'deepseek', -- icon
    'public', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gemini-3.5-flash', -- id
    'Gemini 3.5 Flash', -- name
    'google/gemini-3.5-flash', -- model
    'Google''s latest Flash model, offering frontier-level reasoning and multimodal understanding with the speed of the Flash series', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'gemini', -- icon
    'account_required', -- access
    2, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gemini-3.1-pro', -- id
    'Gemini 3.1 Pro', -- name
    'google/gemini-3.1-pro-preview', -- model
    'Google''s flagship Pro model for the most challenging tasks involving complex reasoning, agentic workflows, and deep multimodal understanding', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'gemini', -- icon
    'premium_required', -- access
    8, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-4.3', -- id
    'Grok 4.3', -- name
    'xai/grok-4.3', -- model
    'xAI''s flagship model with frontier reasoning, vision, and tool use capabilities', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'xai', -- icon
    'premium_required', -- access
    5, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-4.1-fast', -- id
    'Grok 4.1 Fast', -- name
    'xai/grok-4.1-fast-non-reasoning', -- model
    'A fast, low-cost Grok model for everyday tasks, with vision and tool use support', -- description
    '["tools", "vision", "documents"]', -- capabilities
    'xai', -- icon
    'public', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'kimi-k2.6', -- id
    'Kimi K2.6', -- name
    'moonshotai/kimi-k2.6', -- model
    'Moonshot AI''s flagship model with strong reasoning, vision, and agentic tool use capabilities', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'moonshot', -- icon
    'account_required', -- access
    2, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'glm-5.1', -- id
    'GLM 5.1', -- name
    'zai/glm-5.1', -- model
    'Z.ai''s flagship GLM model with improved reasoning, vision, and tool use over the GLM 4 series', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'zai', -- icon
    'account_required', -- access
    2, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'qwen3.7-max', -- id
    'Qwen 3.7 Max', -- name
    'alibaba/qwen3.7-max', -- model
    'Alibaba''s flagship Qwen model with strong reasoning and tool use performance and a near-1M token context window', -- description
    '["tools", "reasoning", "documents"]', -- capabilities
    'qwen', -- icon
    'account_required', -- access
    2, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint

-- Users whose selected model was disabled fall back to the default model.
UPDATE "setting"
SET "model_id" = 'gpt-4o-mini'
WHERE "model_id" IN (
    SELECT "id" FROM "model" WHERE "enabled" = false
);
