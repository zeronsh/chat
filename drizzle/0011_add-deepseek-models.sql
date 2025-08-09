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
    'deepseek-r1-distill-llama-70b', -- id
    'DeepSeek R1 Distill Llama 70B', -- name
    'deepseek/deepseek-r1-distill-llama-70b', -- model
    'DeepSeek-R1 is a state-of-the-art reasoning model trained with reinforcement learning and cold-start data, delivering strong performance across math, code, and complex reasoning tasks. It offers improved stability, readability, and multilingual handling compared to earlier versions, and is available alongside several high-quality distilled variants.', -- description
    '["reasoning"]', -- capabilities
    'deepseek', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
), 
(
    'deepseek-r1', -- id
    'DeepSeek R1', -- name
    'deepseek/deepseek-r1', -- model
    'DeepSeek Reasoner is a specialized model developed by DeepSeek that uses Chain of Thought (CoT) reasoning to improve response accuracy. Before providing a final answer, it generates detailed reasoning steps that are accessible through the API, allowing users to examine and leverage the model''s thought process, served by Fireworks AI.', -- description
    '["reasoning"]', -- capabilities
    'deepseek', -- icon
    'account_required', -- access
    3, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
), 
(
    'deepseek-v3', -- id
    'DeepSeek V3', -- name
    'deepseek/deepseek-v3', -- model
    'Fast general-purpose LLM with enhanced reasoning capabilities', -- description
    '[]', -- capabilities
    'deepseek', -- icon
    'account_required', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
