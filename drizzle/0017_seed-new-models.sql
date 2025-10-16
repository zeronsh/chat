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
    'claude-4.5-haiku', -- id
    'Claude 4.5 Haiku', -- name
    'anthropic/claude-haiku-4.5', -- model
    'Claude Haiku 4.5 matches Sonnet 4''s performance on coding, computer use, and agent tasks at substantially lower cost and faster speeds. It delivers near-frontier performance and Claude''s unique character at a price point that works for scaled sub-agent deployments, free tier products, and intelligence-sensitive applications with budget constraints.', -- description
    '["tools", "reasoning", "documents", "vision"]', -- capabilities
    'anthropic', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'glm-4.6', -- id
    'GLM 4.6', -- name
    'zai/glm-4.6', -- model
    'As the latest iteration in the GLM series, GLM-4.6 achieves comprehensive enhancements across multiple domains, including real-world coding, long-context processing, reasoning, searching, writing, and agentic applications.', -- description
    '["tools", "reasoning", "vision"]', -- capabilities
    'zai', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-4-fast', -- id
    'Grok 4 Fast', -- name
    'xai/grok-4-fast-non-reasoning', -- model
    'Grok 4 Fast is xAI''s latest multimodal model with SOTA cost-efficiency and a 2M token context window. It comes in two flavors: non-reasoning and reasoning.', -- description
    '["tools"]', -- capabilities
    'xai', -- icon
    'public', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
