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
    'gpt-oss-120b', -- id
    'GPT OSS 120B', -- name
    'openai/gpt-oss-120b', -- model
    'gpt-oss-120b is an open-weight, 117B-parameter Mixture-of-Experts (MoE) language model from OpenAI designed for high-reasoning, agentic, and general-purpose production use cases. It activates 5.1B parameters per forward pass and is optimized to run on a single H100 GPU with native MXFP4 quantization. The model supports configurable reasoning depth, full chain-of-thought access, and native tool use, including function calling, browsing, and structured output generation.', -- description
    '["tools", "reasoning"]', -- capabilities
    'openai', -- icon
    'public', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
),
(
    'gpt-oss-20b', -- id
    'GPT OSS 20B', -- name
    'openai/gpt-oss-20b', -- model
    'gpt-oss-20b is an open-weight 21B parameter model released by OpenAI under the Apache 2.0 license. It uses a Mixture-of-Experts (MoE) architecture with 3.6B active parameters per forward pass, optimized for lower-latency inference and deployability on consumer or single-GPU hardware. The model is trained in OpenAI''s Harmony response format and supports reasoning level configuration, fine-tuning, and agentic capabilities including function calling, tool use, and structured outputs.', -- description
    '["tools", "reasoning"]', -- capabilities
    'openai', -- icon
    'public', -- access
    1, -- credits
    NOW(), -- created_at
    NOW() -- updated_at
)
ON CONFLICT ("id") DO NOTHING;
