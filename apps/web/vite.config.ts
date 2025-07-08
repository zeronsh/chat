import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
    plugins: [
        viteTsConfigPaths({
            projects: ['./tsconfig.json'],
        }),
        tanstackStart(),
    ],
});

export default config;
