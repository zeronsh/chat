import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        tsConfigPaths({
            projects: ['./tsconfig.json'],
        }),
        tailwindcss(),
        tanstackStart({
            customViteReactPlugin: true,
        }),
        react(),
        VitePWA({ registerType: 'autoUpdate' }),
    ],
});
