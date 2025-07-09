-- Custom SQL migration file, put your code below! --
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
    'deepseek-r1-distill-llama-70b', -- id
    'DeepSeek R1 Distill Llama 70B', -- name
    'deepseek/deepseek-r1-distill-llama-70b', -- model
    'DeepSeek-R1 is a state-of-the-art reasoning model trained with reinforcement learning and cold-start data, delivering strong performance across math, code, and complex reasoning tasks. It offers improved stability, readability, and multilingual handling compared to earlier versions, and is available alongside several high-quality distilled variants.', -- description
    '["reasoning"]', -- capabilities
    'deepseek', -- icon
    'public', -- access
    NOW(), -- created_at
    NOW() -- updated_at
), 
(
    'gpt-4o', -- id
    'GPT 4o', -- name
    'openai/gpt-4o', -- model
    'GPT-4o from OpenAI has broad general knowledge and domain expertise allowing it to follow complex instructions in natural language and solve difficult problems accurately. It matches GPT-4 Turbo performance with a faster and cheaper API.', -- description
    '["tools", "vision"]', -- capabilities
    'openai', -- icon
    'public', -- access
    NOW(), -- created_at
    NOW() -- updated_at
), 
(
    'gpt-4o-mini', -- id
    'GPT 4o Mini', -- name
    'openai/gpt-4o-mini', -- model
    'GPT-4o mini from OpenAI is their most advanced and cost-efficient small model. It is multi-modal (accepting text or image inputs and outputting text) and has higher intelligence than gpt-3.5-turbo but is just as fast.', -- description
    '["tools", "vision"]', -- capabilities
    'openai', -- icon
    'public', -- access
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
