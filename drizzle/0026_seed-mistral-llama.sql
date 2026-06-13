-- Custom SQL migration file, put your code below! --

-- Add representation for two providers we have icons for but no models:
-- Mistral and Meta (Llama). Prices are micro-dollars per million tokens
-- (gateway $/token * 1e12).
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
    'mistral-large-3', -- id
    'Mistral Large 3', -- name
    'mistral/mistral-large-3', -- model
    'Mistral''s flagship model with strong general reasoning and vision over a 256K context window', -- description
    '["vision"]', -- capabilities
    'mistral', -- icon
    'account_required', -- access
    1, -- credits
    500000, -- input_cost
    1500000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'magistral-medium', -- id
    'Magistral Medium', -- name
    'mistral/magistral-medium', -- model
    'Mistral''s reasoning model, tuned for transparent step-by-step problem solving with vision support', -- description
    '["reasoning", "vision"]', -- capabilities
    'mistral', -- icon
    'account_required', -- access
    2, -- credits
    2000000, -- input_cost
    5000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'llama-4-maverick', -- id
    'Llama 4 Maverick', -- name
    'meta/llama-4-maverick', -- model
    'Meta''s flagship Llama 4 mixture-of-experts model with vision and tool use', -- description
    '["tools", "vision"]', -- capabilities
    'meta', -- icon
    'account_required', -- access
    1, -- credits
    240000, -- input_cost
    970000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'llama-4-scout', -- id
    'Llama 4 Scout', -- name
    'meta/llama-4-scout', -- model
    'A fast, efficient Llama 4 model with vision and tool use, optimized for low-cost high-volume tasks', -- description
    '["tools", "vision"]', -- capabilities
    'meta', -- icon
    'public', -- access
    1, -- credits
    170000, -- input_cost
    660000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
