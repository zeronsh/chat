-- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! --
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
    'gemini-3-pro', -- id
    'Gemini 3 Pro', -- name
    'google/gemini-3-pro-preview', -- model
    'This model improves upon Gemini 2.5 Pro and is catered towards challenging tasks, especially those involving complex reasoning or agentic workflows. Improvements highlighted include use cases for coding, multi-step function calling, planning, reasoning, deep knowledge tasks, and instruction following', -- description
    '["vision", "tools", "reasoning", "documents"]', -- capabilities
    'gemini', -- icon
    'premium_required', -- access
    8, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
