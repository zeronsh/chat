-- Custom SQL migration file, put your code below! --
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
    'gpt-5', -- id
    'GPT 5', -- name
    'openai/gpt-5', -- model
    'GPT-5 is OpenAI''s flagship language model that excels at complex reasoning, broad real-world knowledge, code-intensive, and multi-step agentic tasks.', -- description
    '["tools", "reasoning", "vision"]', -- capabilities
    'openai', -- icon
    'premium_required', -- access
    2, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gpt-5-mini', -- id
    'GPT 5 Mini', -- name
    'openai/gpt-5-mini', -- model
    'GPT-5 mini is a cost optimized model that excels at reasoning/chat tasks. It offers an optimal balance between speed, cost, and capability.', -- description
    '["tools", "reasoning", "vision"]', -- capabilities
    'openai', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gpt-5-nano', -- id
    'GPT 5 Nano', -- name
    'openai/gpt-5-nano', -- model
    'GPT-5 nano is a high throughput model that excels at simple instruction or classification tasks.', -- description
    '["tools", "reasoning", "vision"]', -- capabilities
    'openai', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;

-- Update default pinned models to include new GPT-5 models
ALTER TABLE "setting" ALTER COLUMN "pinned_models" SET DEFAULT '["claude-4-sonnet", "gemini-2.0-flash", "gpt-5", "gpt-5-mini", "gemini-2.5-flash", "gemini-2.5-pro", "kimi-k2"]';

