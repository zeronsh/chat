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
    'gpt-4o', -- id
    'GPT 4o', -- name
    'openai/gpt-4o', -- model
    'GPT-4o from OpenAI has broad general knowledge and domain expertise allowing it to follow complex instructions in natural language and solve difficult problems accurately. It matches GPT-4 Turbo performance with a faster and cheaper API.', -- description
    '["tools", "vision", "documents"]', -- capabilities
    'openai', -- icon
    'account_required', -- access
    2, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
), 
(
    'gpt-4o-mini', -- id
    'GPT 4o Mini', -- name
    'openai/gpt-4o-mini', -- model
    'GPT-4o mini from OpenAI is their most advanced and cost-efficient small model. It is multi-modal (accepting text or image inputs and outputting text) and has higher intelligence than gpt-3.5-turbo but is just as fast.', -- description
    '["tools", "vision", "documents"]', -- capabilities
    'openai', -- icon
    'public', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gemini-2.0-flash', -- id
    'Gemini 2.0 Flash', -- name
    'google/gemini-2.0-flash', -- model
    'Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, built-in tool use, multimodal generation, and a 1M token context window.', -- description
    '["vision", "tools", "documents"]', -- capabilities
    'gemini', -- icon
    'public', -- access
    1, -- credits
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
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gemini-2.5-pro', -- id
    'Gemini 2.5 Pro', -- name
    'google/gemini-2.5-pro', -- model
    'Gemini 2.5 Pro is our most advanced reasoning Gemini model, capable of solving complex problems. It features a 2M token context window and supports multimodal inputs including text, images, audio, video, and PDF documents.', -- description
    '["vision", "tools", "reasoning", "documents"]', -- capabilities
    'gemini', -- icon
    'premium_required', -- access
    5, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-4', -- id
    'Grok 4', -- name
    'xai/grok-4', -- model
    'xAI''s latest and greatest flagship model, offering unparalleled performance in natural language, math and reasoning - the perfect jack of all trades.', -- description
    '["reasoning", "tools"]', -- capabilities
    'xai', -- icon
    'premium_required', -- access
    5, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-3', -- id
    'Grok 3', -- name
    'xai/grok-3', -- model
    'xAI''s flagship model that excels at enterprise use cases like data extraction, coding, and text summarization. Possesses deep domain knowledge in finance, healthcare, law, and science.', -- description
    '["tools"]', -- capabilities
    'xai', -- icon
    'premium_required', -- access
    5, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'grok-3-mini', -- id
    'Grok 3 Mini', -- name
    'xai/grok-3-mini', -- model
    'xAI''s lightweight model that thinks before responding. Great for simple or logic-based tasks that do not require deep domain knowledge. The raw thinking traces are accessible.', -- description
    '["tools", "reasoning"]', -- capabilities
    'xai', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'kimi-k2', -- id
    'Kimi K2', -- name
    'moonshotai/kimi-k2', -- model
    'Kimi K2 is a model with a context length of 128k, featuring powerful code and Agent capabilities based on MoE architecture. It has 1T total parameters with 32B activated parameters. In benchmark performance tests across major categories including general knowledge reasoning, programming, mathematics, and Agent capabilities, the K2 model outperforms other mainstream open-source models.', -- description
    '["tools"]', -- capabilities
    'openrouter', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
