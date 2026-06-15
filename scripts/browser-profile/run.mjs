/**
 * REAL-browser streaming profiler. Bundles `<Markdown fade>` with esbuild, loads
 * it in headless Chromium (cached playwright browser), streams a ~10k-word story
 * into it, and records actual per-frame main-thread blocking — with the fade
 * overlay ON vs OFF. Unlike the happy-dom profiler, this measures real layout,
 * paint, and canvas work.
 *
 * Run:  node scripts/browser-profile/run.mjs
 */
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const cacheRoot = join(process.env.HOME, 'Library/Caches/ms-playwright');
function findChromium() {
    for (const d of readdirSync(cacheRoot)) {
        if (d.startsWith('chromium_headless_shell-')) {
            return join(cacheRoot, d, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell');
        }
    }
    throw new Error('no cached chrome-headless-shell found');
}

// ── Bundle the entry for the browser ─────────────────────────────────────────
const bundle = await build({
    entryPoints: [join(here, 'entry.jsx')],
    bundle: true,
    format: 'iife',
    write: false,
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    loader: { '.jsx': 'jsx' },
});
const js = bundle.outputFiles[0].text;
const html = `<!doctype html><html><head><meta charset=utf8></head><body><div id=root></div><script>${js}</script></body></html>`;

// ── Build a ~10k-word markdown story ─────────────────────────────────────────
const LEX = 'the wind moved through the valley as travellers passed each carrying a story longer than the last and none of them looked back at the town they left behind where lights still burned in distant windows'.split(' ');
function story(targetWords) {
    let out = '', words = 0, p = 0;
    while (words < targetWords) {
        if (p % 6 === 0) out += `\n## Section ${p / 6 + 1}\n\n`;
        const para = [];
        for (let s = 0; s < 4; s++) {
            const n = 10 + ((p + s) % 12);
            const w = [];
            for (let i = 0; i < n; i++) w.push(LEX[(p * 7 + s * 13 + i * 5) % LEX.length]);
            let line = w.join(' ');
            if ((p + s) % 3 === 0) line = line.replace(/(\w+) (\w+)/, '**$1 $2**');
            para.push(line[0].toUpperCase() + line.slice(1) + '.');
        }
        const text = para.join(' ');
        out += text + '\n\n';
        words += text.split(' ').length;
        p++;
    }
    return out;
}
const words = story(10000).split(' ');

const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage({ viewport: { width: 900, height: 800 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForFunction('window.__ready === true');

async function streamRun(fade) {
    await page.evaluate(f => {
        window.__setFade(f);
        window.__setSource('');
        window.__frames.length = 0;
    }, fade);
    await page.waitForTimeout(150);

    // Stream ~25 words per tick, ~10 ticks/sec (like the app's 100ms throttle),
    // tagging each committed size with the frame intervals that follow it.
    const marks = [];
    let acc = '';
    let i = 0;
    const STEP = 25;
    while (i < words.length) {
        acc += (i ? ' ' : '') + words.slice(i, i + STEP).join(' ');
        i += STEP;
        const before = await page.evaluate(() => window.__frames.length);
        await page.evaluate(s => window.__setSource(s), acc);
        await page.waitForTimeout(100); // ~one throttle window of frames
        const wc = i;
        const heightAndFrames = await page.evaluate(
            from => {
                const frames = window.__frames.slice(from);
                const h = document.querySelector('#root > div').getBoundingClientRect().height;
                return { frames, h };
            },
            before,
        );
        if (wc % 1000 < STEP) {
            const fr = heightAndFrames.frames;
            const max = fr.length ? Math.max(...fr) : 0;
            marks.push({ words: wc, height: Math.round(heightAndFrames.h), maxFrame: max, frames: fr });
        }
    }
    return marks;
}

console.log('Streaming a ~10k-word story in real headless Chromium…\n');
const withFade = await streamRun(true);
const noFade = await streamRun(false);
await browser.close();

const pad = (s, n) => String(s).padStart(n);
console.log(`${pad('words', 6)} ${pad('height', 7)} │ ${pad('worst frame: FADE ON', 22)} │ ${pad('FADE OFF', 12)}`);
console.log('─'.repeat(60));
for (let i = 0; i < withFade.length; i++) {
    const a = withFade[i], b = noFade[i];
    console.log(`${pad(a.words, 6)} ${pad(a.height + 'px', 7)} │ ${pad(a.maxFrame.toFixed(1) + 'ms', 22)} │ ${pad((b?.maxFrame ?? 0).toFixed(1) + 'ms', 12)}`);
}
const worst = arr => Math.max(...arr.map(m => m.maxFrame));
console.log('─'.repeat(60));
console.log(
    `\nworst single frame — FADE ON: ${worst(withFade).toFixed(0)}ms   FADE OFF: ${worst(noFade).toFixed(0)}ms` +
        `\n(60fps budget is 16.7ms; anything above that is a dropped frame / visible lag)`,
);
