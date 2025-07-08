import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

const config = defineConfig({
    plugins: [
        viteTsConfigPaths({
            projects: ['./tsconfig.json'],
        }),
        tailwindcss(),
        tanstackStart(),
    ],
});

export default config;
