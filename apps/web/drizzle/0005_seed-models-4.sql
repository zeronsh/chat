-- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! --
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
    'kimi-k2', -- id
    'Kimi K2', -- name
    'moonshotai/kimi-k2', -- model
    'Kimi K2 is a model with a context length of 128k, featuring powerful code and Agent capabilities based on MoE architecture. It has 1T total parameters with 32B activated parameters. In benchmark performance tests across major categories including general knowledge reasoning, programming, mathematics, and Agent capabilities, the K2 model outperforms other mainstream open-source models.', -- description
    '["tools"]', -- capabilities
    'openrouter', -- icon
    'premium_required', -- access
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
