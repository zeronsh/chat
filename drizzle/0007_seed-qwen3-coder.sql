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
    'qwen3-coder', -- id
    'Qwen3 Coder', -- name
    'alibaba/qwen3-coder', -- model
    'Qwen3-Coder-480B-A35B-Instruct is Qwen''s most agentic code model, featuring significant performance on Agentic Coding, Agentic Browser-Use and other foundational coding tasks, achieving results comparable to Claude Sonnet.', -- description
    '["tools"]', -- capabilities
    'qwen', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
