-- Custom SQL migration file, put your code below! --

-- Newer Kimi models on the Vercel AI Gateway that were missed in the flagship
-- seed. Prices are micro-dollars per million tokens (gateway $/token * 1e12).
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
    'kimi-k2.5', -- id
    'Kimi K2.5', -- name
    'moonshotai/kimi-k2.5', -- model
    'Moonshot AI''s K2.5 with reasoning and vision, a strong general-purpose model for agentic and multimodal tasks', -- description
    '["tools", "reasoning", "vision"]', -- capabilities
    'moonshot', -- icon
    'account_required', -- access
    2, -- credits
    600000, -- input_cost
    3000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'kimi-k2.7-code', -- id
    'Kimi K2.7 Code', -- name
    'moonshotai/kimi-k2.7-code', -- model
    'Moonshot AI''s latest coding-focused Kimi model, tuned for agentic software engineering with reasoning, vision, and document input', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'moonshot', -- icon
    'account_required', -- access
    2, -- credits
    950000, -- input_cost
    4000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
