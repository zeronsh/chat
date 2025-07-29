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
    'glm-4.5-air', -- id
    'GLM 4.5 Air', -- name
    'zai/glm-4.5-air', -- model
    'GLM-4.5 and GLM-4.5-Air are our latest flagship models, purpose-built as foundational models for agent-oriented applications. Both leverage a Mixture-of-Experts (MoE) architecture. GLM-4.5 has a total parameter count of 355B with 32B active parameters per forward pass, while GLM-4.5-Air adopts a more streamlined design with 106B total parameters and 12B active parameters.', -- description
    '["tools"]', -- capabilities
    'zai', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
), 
(
    'glm-4.5', -- id
    'GLM 4.5', -- name
    'zai/glm-4.5', -- model
    'GLM-4.5 and GLM-4.5-Air are our latest flagship models, purpose-built as foundational models for agent-oriented applications. Both leverage a Mixture-of-Experts (MoE) architecture. GLM-4.5 has a total parameter count of 355B with 32B active parameters per forward pass, while GLM-4.5-Air adopts a more streamlined design with 106B total parameters and 12B active parameters.', -- description
    '["tools", "reasoning"]', -- capabilities
    'zai', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
