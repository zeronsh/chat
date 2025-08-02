import AnthropicIcon from '@/components/icons/anthropic';
import ClaudeIcon from '@/components/icons/claude';
import DeepseekIcon from '@/components/icons/deepseek';
import GeminiIcon from '@/components/icons/gemini';
import GoogleIcon from '@/components/icons/google';
import GrokIcon from '@/components/icons/grok';
import MetaIcon from '@/components/icons/meta';
import MistralIcon from '@/components/icons/mistral';
import OllamaIcon from '@/components/icons/ollama';
import OpenAIIcon from '@/components/icons/openai';
import OpenRouterIcon from '@/components/icons/openrouter';
import XIcon from '@/components/icons/x';
import XAIIcon from '@/components/icons/xai';
import MoonshotIcon from '@/components/icons/moonshot';
import ZaiIcon from '@/components/icons/zai';
import QwenIcon from '@/components/icons/qwen';
import type { SVGProps } from 'react';

export type ModelType =
    | 'anthropic'
    | 'claude'
    | 'deepseek'
    | 'gemini'
    | 'google'
    | 'grok'
    | 'meta'
    | 'mistral'
    | 'ollama'
    | 'openai'
    | 'openrouter'
    | 'x'
    | 'xai'
    | 'zai'
    | 'moonshot'
    | 'qwen'
    | string;

interface ModelIconProps extends SVGProps<SVGSVGElement> {
    model: ModelType;
}

const ModelIcon = ({ model, ...props }: ModelIconProps) => {
    const icons: Record<ModelType, React.ComponentType<SVGProps<SVGSVGElement>>> = {
        anthropic: AnthropicIcon,
        claude: ClaudeIcon,
        deepseek: DeepseekIcon,
        gemini: GeminiIcon,
        google: GoogleIcon,
        grok: GrokIcon,
        meta: MetaIcon,
        mistral: MistralIcon,
        ollama: OllamaIcon,
        openai: OpenAIIcon,
        openrouter: OpenRouterIcon,
        x: XIcon,
        xai: XAIIcon,
        zai: ZaiIcon,
        moonshot: MoonshotIcon,
        qwen: QwenIcon,
    };

    const Icon = icons[model];

    if (!Icon) {
        return null;
    }

    return <Icon {...props} />;
};

export default ModelIcon;
