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
    'glm-4.5v', -- id
    'GLM 4.5V', -- name
    'zai/glm-4.5v', -- model
    'Built on the GLM-4.5-Air base model, GLM-4.5V inherits proven techniques from GLM-4.1V-Thinking while achieving effective scaling through a powerful 106B-parameter MoE architecture.', -- description
    '["tools", "reasoning", "vision"]', -- capabilities
    'zai', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
