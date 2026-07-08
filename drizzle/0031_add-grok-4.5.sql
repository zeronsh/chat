-- Custom SQL migration file, put your code below! --

-- Grok 4.5 — xAI's new flagship (released 2026-07-08), succeeding grok-4.3.
-- Frontier coding/knowledge/STEM model with a 500K context window. Capabilities
-- mirror grok-4.3 (tools, reasoning, vision, documents) since the gateway lists
-- the same file-input + vision modalities. Prices are micro-dollars per million
-- tokens from the gateway base pricing tier (input $2/M, output $6/M).
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
    'grok-4.5', -- id
    'Grok 4.5', -- name
    'xai/grok-4.5', -- model
    'xAI''s smartest Grok model, with frontier performance on coding, knowledge work, and STEM over a 500K context window', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'xai', -- icon
    'premium_required', -- access
    5, -- credits
    2000000, -- input_cost
    6000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;