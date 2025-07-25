import { useEffect, useState } from 'react';
import { type Highlighter, createCssVariablesTheme, createHighlighter } from 'shiki';

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

const myTheme = createCssVariablesTheme({
    name: 'css-variables',
    variablePrefix: '--shiki-',
    variableDefaults: {},
    fontStyle: true,
});

const getHighlighter = async (): Promise<Highlighter> => {
    if (highlighterInstance) {
        return highlighterInstance;
    }

    if (highlighterPromise) {
        return highlighterPromise;
    }

    highlighterPromise = createHighlighter({
        themes: [myTheme],
        langs: [
            'javascript',
            'typescript',
            'jsx',
            'tsx',
            'python',
            'java',
            'c',
            'cpp',
            'csharp',
            'php',
            'ruby',
            'go',
            'rust',
            'swift',
            'kotlin',
            'scala',
            'html',
            'css',
            'scss',
            'sass',
            'json',
            'xml',
            'yaml',
            'markdown',
            'bash',
            'shell',
            'sql',
            'dockerfile',
            'nginx',
            'apache',
            'plaintext',
        ],
    });

    highlighterInstance = await highlighterPromise;
    return highlighterInstance;
};

interface UseCodeHighlighterOptions {
    codeString: string;
    language: string;
    inline?: boolean;
    shouldHighlight?: boolean;
}

export const useCodeHighlighter = ({
    codeString,
    language,
    shouldHighlight = true,
}: UseCodeHighlighterOptions) => {
    const [highlightedCode, setHighlightedCode] = useState<string>('');
    const [isHighlighting, setIsHighlighting] = useState(true);

    useEffect(() => {
        const highlightCode = async () => {
            if (!shouldHighlight || !codeString) {
                setIsHighlighting(false);
                return;
            }

            try {
                setIsHighlighting(true);
                const highlighter = await getHighlighter();

                setTimeout(() => {
                    const supportedLangs = highlighter.getLoadedLanguages();
                    const langToUse = supportedLangs.includes(language) ? language : 'plaintext';
                    const highlighted = highlighter.codeToHtml(codeString, {
                        lang: langToUse,
                        theme: 'css-variables',
                    });
                    setHighlightedCode(highlighted);
                }, 0);
            } catch (error) {
                console.error('Error highlighting code:', error);
                // Fallback to plain text if highlighting fails
                setHighlightedCode(`<pre><code>${codeString}</code></pre>`);
            } finally {
                setIsHighlighting(false);
            }
        };

        highlightCode();
    }, [codeString, language, shouldHighlight]);

    return {
        highlightedCode,
        isHighlighting,
    };
};
