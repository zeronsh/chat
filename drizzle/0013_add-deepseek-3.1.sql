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
    'deepseek-v3.1', -- id
    'DeepSeek V3.1', -- name
    'deepseek/deepseek-v3.1', -- model
    'DeepSeek-V3.1 is post-trained on the top of DeepSeek-V3.1-Base, which is built upon the original V3 base checkpoint through a two-phase long context extension approach, following the methodology outlined in the original DeepSeek-V3 report. DeepSeek has expanded their dataset by collecting additional long documents and substantially extending both training phases.', -- description
    '["tools"]', -- capabilities
    'deepseek', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
