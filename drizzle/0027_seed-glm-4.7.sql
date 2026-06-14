-- Custom SQL migration file, put your code below! --

-- GLM 4.7 — the 4.7-line release we skipped between GLM 4.6 and GLM 5.1.
-- Prices are micro-dollars per million tokens (gateway $/token * 1e12).
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
    'glm-4.7', -- id
    'GLM 4.7', -- name
    'zai/glm-4.7', -- model
    'Z.ai''s GLM 4.7 with strong reasoning and tool use, refining the 4.x line for agentic and coding tasks', -- description
    '["tools", "reasoning"]', -- capabilities
    'zai', -- icon
    'account_required', -- access
    2, -- credits
    2250000, -- input_cost
    2750000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
