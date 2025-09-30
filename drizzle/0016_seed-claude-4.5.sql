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
    'claude-4.5-sonnet', -- id
    'Claude 4.5 Sonnet', -- name
    'anthropic/claude-sonnet-4.5', -- model
    'Claude Sonnet 4.5 is the newest model in the Sonnet series, offering improvements and updates over Sonnet 4.', -- description
    '["tools", "reasoning", "documents", "vision"]', -- capabilities
    'anthropic', -- icon
    'premium_required', -- access
    5, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
