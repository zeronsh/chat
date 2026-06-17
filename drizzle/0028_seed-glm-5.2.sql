-- Custom SQL migration file, put your code below! --

-- GLM 5.2 — Z.ai's latest flagship, succeeding GLM 5.1.
-- Prices are micro-dollars per million tokens (gateway $/token * 1e12):
-- input $0.0000014/tok -> 1,400,000 ; output $0.0000044/tok -> 4,400,000.
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
    'glm-5.2', -- id
    'GLM 5.2', -- name
    'zai/glm-5.2', -- model
    'Z.ai''s latest flagship GLM model, refining the GLM 5 line with stronger reasoning, vision, and tool use', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'zai', -- icon
    'account_required', -- access
    2, -- credits
    1400000, -- input_cost
    4400000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
