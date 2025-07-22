-- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! --
INSERT INTO "model" (
    "id", 
    "name", 
    "model", 
    "description", 
    "capabilities", 
    "icon", 
    "access", 
    "created_at", 
    "updated_at"
) 
VALUES 
(
    'grok-4', -- id
    'Grok 4', -- name
    'xai/grok-4', -- model
    'xAI''s latest and greatest flagship model, offering unparalleled performance in natural language, math and reasoning - the perfect jack of all trades.', -- description
    '["reasoning", "tools"]', -- capabilities
    'xai', -- icon
    'premium_required', -- access
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-3', -- id
    'Grok 3', -- name
    'xai/grok-3', -- model
    'xAI''s flagship model that excels at enterprise use cases like data extraction, coding, and text summarization. Possesses deep domain knowledge in finance, healthcare, law, and science.', -- description
    '["tools"]', -- capabilities
    'xai', -- icon
    'premium_required', -- access
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-3-mini', -- id
    'Grok 3 Mini', -- name
    'xai/grok-3-mini', -- model
    'xAI''s lightweight model that thinks before responding. Great for simple or logic-based tasks that do not require deep domain knowledge. The raw thinking traces are accessible.', -- description
    '["tools", "reasoning"]', -- capabilities
    'xai', -- icon
    'premium_required', -- access
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
