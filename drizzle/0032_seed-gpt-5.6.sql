-- Custom SQL migration file, put your code below! --

-- OpenAI's GPT-5.6 line (released 2026-07-09), succeeding gpt-5.5. Three tiers
-- on the Vercel AI Gateway, all 1.05M context with reasoning, tools, vision, and
-- document (file) input:
--   openai/gpt-5.6-sol    flagship, most capable (shares gpt-5.5 pricing)
--   openai/gpt-5.6-terra  balanced everyday tier
--   openai/gpt-5.6-luna   fast/affordable entry tier
-- Not in models.dev yet, so capabilities are mapped from the gateway tags
-- (reasoning, tool-use, vision, file-input). Prices are micro-dollars per million
-- tokens (gateway $/token * 1e12).
INSERT INTO "model" (
    "id",
    "name",
    "model",
    "description",
    "capabilities",
    "icon",
    "access",
    "credits",
    "input_cost",
    "output_cost",
    "created_at",
    "updated_at"
)
VALUES
(
    'gpt-5.6-sol', -- id
    'GPT-5.6 Sol', -- name
    'openai/gpt-5.6-sol', -- model
    'OpenAI''s flagship GPT-5.6 model, its most capable for long-horizon agentic work across coding, biology, and cybersecurity', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'openai', -- icon
    'premium_required', -- access
    8, -- credits
    5000000, -- input_cost
    30000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gpt-5.6-terra', -- id
    'GPT-5.6 Terra', -- name
    'openai/gpt-5.6-terra', -- model
    'A balanced GPT-5.6 model for everyday work, matching the previous generation''s performance at half the cost', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'openai', -- icon
    'premium_required', -- access
    4, -- credits
    2500000, -- input_cost
    15000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gpt-5.6-luna', -- id
    'GPT-5.6 Luna', -- name
    'openai/gpt-5.6-luna', -- model
    'A fast, affordable GPT-5.6 model delivering strong capability at the lowest cost in the series', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'openai', -- icon
    'account_required', -- access
    2, -- credits
    1000000, -- input_cost
    6000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;