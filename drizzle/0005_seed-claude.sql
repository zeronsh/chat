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
    'claude-4-sonnet', -- id
    'Claude 4 Sonnet', -- name
    'anthropic/claude-4-sonnet', -- model
    'Claude Sonnet 4 significantly improves on Sonnet 3.7''s industry-leading capabilities, excelling in coding with a state-of-the-art 72.7% on SWE-bench. The model balances performance and efficiency for internal and external use cases, with enhanced steerability for greater control over implementations. While not matching Opus 4 in most domains, it delivers an optimal mix of capability and practicality.', -- description
    '["tools", "reasoning", "documents", "vision"]', -- capabilities
    'anthropic', -- icon
    'premium_required', -- access
    5, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
