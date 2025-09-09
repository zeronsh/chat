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
    'kimi-k2-0905', -- id
    'Kimi K2 0905', -- name
    'moonshotai/kimi-k2-0905', -- model
    'Kimi K2 0905 is the September update of Kimi K2. It is a large-scale Mixture-of-Experts (MoE) language model developed by Moonshot AI, featuring 1 trillion total parameters with 32 billion active per forward pass. It supports long-context inference up to 256k tokens, extended from the previous 128k.', -- description
    '["tools"]', -- capabilities
    'moonshot', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'qwen3-max', -- id
    'Qwen3 Max', -- name
    'alibaba/qwen3-max', -- model
    'Qwen3-Max is an updated release built on the Qwen3 series, offering major improvements in reasoning, instruction following, multilingual support, and long-tail knowledge coverage compared to the January 2025 version.', -- description
    '["tools"]', -- capabilities
    'qwen', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-code-fast-1', -- id
    'Grok Code Fast 1', -- name
    'xai/grok-code-fast-1', -- model
    'Grok Code Fast 1 is a speedy and economical reasoning model that excels at agentic coding. With reasoning traces visible in the response, developers can steer Grok Code for high-quality work flows.', -- description
    '["tools"]', -- capabilities
    'xai', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
