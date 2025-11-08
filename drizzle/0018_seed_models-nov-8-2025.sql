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
    'kimi-k2-thinking', -- id
    'Kimi K2 Thinking', -- name
    'moonshotai/kimi-k2-thinking', -- model
    'Kimi K2 Thinking is an advanced open-source thinking model by Moonshot AI. It can execute up to 200 – 300 sequential tool calls without human interference, reasoning coherently across hundreds of steps to solve complex problems. Built as a thinking agent, it reasons step by step while using tools, achieving state-of-the-art performance on Humanity''s Last Exam (HLE), BrowseComp, and other benchmarks, with major gains in reasoning, agentic search, coding, writing, and general capabilities.', -- description
    '["tools", "reasoning"]', -- capabilities
    'moonshot', -- icon
    'premium_required', -- access
    3, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
