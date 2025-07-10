-- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! --
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
    'gemini-2.0-flash', -- id
    'Gemini 2.0 Flash', -- name
    'google/gemini-2.0-flash', -- model
    'Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, built-in tool use, multimodal generation, and a 1M token context window.', -- description
    '["vision", "tools"]', -- capabilities
    'gemini', -- icon
    'public', -- access
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gemini-2.5-flash', -- id
    'Gemini 2.5 Flash', -- name
    'google/gemini-2.5-flash', -- model
    'Gemini 2.5 Flash is a thinking model that offers great, well-rounded capabilities. It is designed to offer a balance between price and performance with multimodal support and a 1M token context window.', -- description
    '["vision", "tools", "reasoning"]', -- capabilities
    'gemini', -- icon
    'public', -- access
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gemini-2.5-pro', -- id
    'Gemini 2.5 Pro', -- name
    'google/gemini-2.5-pro', -- model
    'Gemini 2.5 Pro is our most advanced reasoning Gemini model, capable of solving complex problems. It features a 2M token context window and supports multimodal inputs including text, images, audio, video, and PDF documents.', -- description
    '["vision", "tools", "reasoning"]', -- capabilities
    'gemini', -- icon
    'account_required', -- access
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
