-- Custom SQL migration file, put your code below! --

-- Latest models on the Vercel AI Gateway that postdate our current frontier for
-- each provider we support and were missing on prod (last sweep 2026-07-09):
--   anthropic/claude-opus-5   (new Opus flagship, succeeds claude-opus-4.8)
--   moonshotai/kimi-k3        (Kimi's new flagship, succeeds the k2.x line)
--   alibaba/qwen3.8-max       (new Qwen Max, succeeds qwen3.7-max)
--   google/gemini-3.6-flash   (new Flash tier, succeeds gemini-3.5-flash)
--   meta/muse-spark-1.1       (Meta's new agentic line; missed by the last sweep)
-- Skipped per precedent: -fast serving variants (claude-opus-5-fast,
-- kimi-k3-fast) and lite/flash sub-tiers (gemini-3.5-flash-lite, qwen3.7-flash).
-- Capabilities map from the gateway tags (tool-use=tools, reasoning,
-- vision, file-input=documents); qwen3.8-max has no file-input tag. Prices are
-- micro-dollars per million tokens (gateway $/token * 1e12).
INSERT INTO "model" (
    "id",
    "name",
    "model",
    "description",
    "capabilities",
    "icon",
    "access",
    "credits",
    "input_cost",
    "output_cost",
    "created_at",
    "updated_at"
)
VALUES
(
    'claude-5-opus', -- id
    'Claude Opus 5', -- name
    'anthropic/claude-opus-5', -- model
    'Anthropic''s new Opus flagship, a step-change over Opus 4.8 in agentic coding, professional knowledge work, and long-horizon reasoning', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'anthropic', -- icon
    'premium_required', -- access
    8, -- credits
    5000000, -- input_cost
    25000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'kimi-k3', -- id
    'Kimi K3', -- name
    'moonshotai/kimi-k3', -- model
    'Moonshot AI''s flagship model for long-horizon coding and end-to-end knowledge work, with a 1M-token context window', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'moonshot', -- icon
    'premium_required', -- access
    5, -- credits
    3000000, -- input_cost
    15000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'qwen3.8-max', -- id
    'Qwen 3.8 Max', -- name
    'alibaba/qwen3.8-max', -- model
    'Alibaba''s 2.4T-parameter MoE flagship for autonomous coding and professional work, with native visual understanding across planning, execution, and verification', -- description
    '["tools", "reasoning", "vision"]', -- capabilities
    'qwen', -- icon
    'account_required', -- access
    2, -- credits
    2000000, -- input_cost
    6000000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gemini-3.6-flash', -- id
    'Gemini 3.6 Flash', -- name
    'google/gemini-3.6-flash', -- model
    'Google''s new Flash tier with higher quality across coding, agentic workflows, and web development at reduced token consumption', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'gemini', -- icon
    'account_required', -- access
    2, -- credits
    1500000, -- input_cost
    7500000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'muse-spark-1.1', -- id
    'Muse Spark 1.1', -- name
    'meta/muse-spark-1.1', -- model
    'Meta''s agentic model, strongest at tool use and computer use, with parallel sub-agent delegation and a 1M-token context window', -- description
    '["tools", "reasoning", "vision", "documents"]', -- capabilities
    'meta', -- icon
    'account_required', -- access
    2, -- credits
    1250000, -- input_cost
    4250000, -- output_cost
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
