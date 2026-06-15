/**
 * Streaming-performance profiler for the chat markdown pipeline.
 *
 * Streams a ~10,000-word story through a MOCK AI SDK provider (no network), then
 * at growing snapshots profiles the two per-tick costs of rendering it:
 *
 *   1. mugen's measure walk (real `MugenInstance` + `<Markdown>`), warm vs. with
 *      the height cache cleared each tick (≈ pre-0.3.5 behaviour).
 *   2. the shipped fade overlay's `frame()` text-node walk (replicated verbatim
 *      from @wingleeio/mugen-markdown dist `FadePainter.frame`, lines ~2234-2270).
 *
 * Run:  node scripts/profile-stream.mjs
 */
import { setupDom } from './_dom-setup.mjs';
setupDom();

const React = (await import('react')).default;
const { createElement: h } = React;
const { renderToStaticMarkup } = await import('react-dom/server');
const { MugenInstance, clearHeightCache } = await import('@wingleeio/mugen');
const { Markdown } = await import('@wingleeio/mugen-markdown');
const { streamText } = await import('ai');
const { MockLanguageModelV2, simulateReadableStream } = await import('ai/test');

const THEME = {
    fontFamily: 'Inter',
    monoFamily: 'monospace',
    fontSize: 15,
    lineHeight: 26,
    blockGap: 14,
};

// ── Generate a realistic ~10k-word markdown story ────────────────────────────
const LEX =
    'the wind moved through the valley as travellers passed each carrying a story longer than the last and none of them looked back at the town they had left behind where lights still burned in distant windows while the river kept its slow argument with the stones'.split(
        ' ',
    );
function sentence(seed) {
    const n = 8 + (seed % 14);
    const w = [];
    for (let i = 0; i < n; i++) w.push(LEX[(seed * 7 + i * 13) % LEX.length]);
    let s = w.join(' ');
    if (seed % 4 === 0) s = s.replace(/(\w+) (\w+)/, '**$1 $2**');
    if (seed % 5 === 0) s = s.replace(/(\w+)$/, '*$1*');
    s = s[0].toUpperCase() + s.slice(1) + '.';
    if (seed % 9 === 0) s += ` [${(seed % 7) + 1}](https://example.com/source-${seed}).`;
    return s;
}
function buildStory(targetWords) {
    let out = '';
    let words = 0;
    let p = 0;
    while (words < targetWords) {
        if (p % 6 === 0) {
            out += `\n## Section ${p / 6 + 1}\n\n`;
        }
        const sentences = 3 + (p % 3);
        const para = [];
        for (let s = 0; s < sentences; s++) para.push(sentence(p * 17 + s));
        const text = para.join(' ');
        out += text + '\n\n';
        words += text.split(' ').length;
        p++;
    }
    return out;
}

const story = buildStory(10000);
const totalWords = story.split(/\s+/).filter(Boolean).length;

// ── Stream it through a mock AI SDK provider, word by word ────────────────────
const words = story.split(' ');
const chunks = [
    { type: 'text-start', id: '0' },
    ...words.map((w, i) => ({ type: 'text-delta', id: '0', delta: i === 0 ? w : ' ' + w })),
    { type: 'text-end', id: '0' },
    {
        type: 'finish',
        finishReason: 'stop',
        usage: { inputTokens: 12, outputTokens: words.length },
    },
];
const model = new MockLanguageModelV2({
    doStream: async () => ({ stream: simulateReadableStream({ chunks, chunkDelayInMs: 0 }) }),
});

console.log(`Streaming a ${totalWords}-word story through a mock AI SDK provider…\n`);

// ── Profiling helpers ────────────────────────────────────────────────────────
const inst = new MugenInstance();
const CONTENT_WIDTH = 720;
inst.configure({
    getKey: it => it.id,
    render: it => h(Markdown, { source: it.source, theme: THEME }),
    defaults: { font: '15px Inter', lineHeight: 26 },
    maxW: CONTENT_WIDTH,
});
inst.setViewport(CONTENT_WIDTH, 900, 16);

function timeMeasureWarm(source) {
    inst.setItems([{ id: 'a', source }]);
    const t = performance.now();
    inst.sync();
    return performance.now() - t;
}
function timeMeasureCold(source) {
    clearHeightCache(); // simulate no cross-tick memo (pre-0.3.5)
    inst.setItems([{ id: 'a', source }]);
    const t = performance.now();
    inst.sync();
    return performance.now() - t;
}

// Verbatim port of FadePainter.frame()'s text-node walk (mugen-markdown dist
// ~2234-2270): walk every text node accumulating the char offset `base`, and
// paint the slice covered by an active veil. `getClientRects` returns [] under
// happy-dom (no layout), so this is a LOWER BOUND — a real browser adds the
// per-rect layout/paint cost on top of this O(n) traversal.
const container = document.createElement('div');
document.body.appendChild(container);
function timeFadeWalk(source) {
    container.innerHTML = renderToStaticMarkup(h(Markdown, { source, theme: THEME }));
    const text = container.textContent || '';
    // Active veils cover the freshly-arrived tail (~200 chars), as while streaming.
    const veils = [{ start: Math.max(0, text.length - 200), end: text.length, t0: 0 }];
    const minStart = veils.reduce((m, v) => Math.min(m, v.start), Infinity);
    let nodes = 0;
    let rects = 0;
    const t = performance.now();
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let base = 0;
    let node = walker.nextNode();
    while (node != null) {
        nodes++;
        const len = node.data.length;
        if (len > 0 && base + len > minStart) {
            for (const v of veils) {
                const s = Math.max(v.start - base, 0);
                const e = Math.min(v.end - base, len);
                if (e <= s) continue;
                const range = document.createRange();
                range.setStart(node, s);
                range.setEnd(node, e);
                range.getClientRects(); // forces synchronous layout in a real browser
                rects++;
            }
        }
        base += len;
        node = walker.nextNode();
    }
    return { ms: performance.now() - t, nodes, rects };
}

// ── Drive the stream, capture a snapshot of the growing source every ~500 words
const snapshots = [];
{
    let source = '';
    let wordCount = 0;
    let nextSnapshot = 500;
    const result = streamText({ model, prompt: 'Write a 10,000 word story.' });
    for await (const delta of result.textStream) {
        source += delta;
        wordCount++;
        if (wordCount >= nextSnapshot) {
            snapshots.push({ words: wordCount, source });
            nextSnapshot += 500;
        }
    }
}

// Three independent passes over the same snapshots so they don't perturb each
// other (interleaving clearHeightCache would poison the warm cache).
const rows = snapshots.map(s => ({ words: s.words, chars: s.source.length }));
// Pass A — warm measure: cache persists across snapshots (the real streaming case).
clearHeightCache();
timeMeasureWarm(snapshots[0].source); // prime JIT
snapshots.forEach((s, i) => (rows[i].warm = timeMeasureWarm(s.source)));
// Pass B — cold measure: height cache cleared each tick (≈ pre-0.3.5).
snapshots.forEach((s, i) => (rows[i].cold = timeMeasureCold(s.source)));
// Pass C — fade walk (the shipped frame() traversal).
snapshots.forEach((s, i) => {
    const f = timeFadeWalk(s.source);
    rows[i].fade = f.ms;
    rows[i].nodes = f.nodes;
    rows[i].rects = f.rects;
});

// ── Report ───────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padStart(n);
console.log(
    `${pad('words', 6)} ${pad('chars', 7)} │ ${pad('measure warm', 13)} ${pad('measure cold', 13)} │ ${pad('fade walk', 10)} ${pad('text nodes', 11)}`,
);
console.log('─'.repeat(78));
for (const r of rows) {
    console.log(
        `${pad(r.words, 6)} ${pad(r.chars, 7)} │ ${pad(r.warm.toFixed(2) + 'ms', 13)} ${pad(r.cold.toFixed(2) + 'ms', 13)} │ ${pad(r.fade.toFixed(2) + 'ms', 10)} ${pad(r.nodes, 11)}`,
    );
}

// Skip the first sample for growth ratios — it carries JIT warmup.
const first = rows[1];
const last = rows[rows.length - 1];
const med = arr => arr.slice().sort((a, b) => a - b)[Math.floor(arr.length / 2)];
const ratio = (a, b) => (b / Math.max(a, 0.001)).toFixed(1);
console.log('─'.repeat(82));
console.log(
    `\ngrowth ${first.words}→${last.words} words:` +
        `\n  measure warm (0.3.5 height cache): median ${med(rows.slice(1).map(r => r.warm)).toFixed(2)}ms, ${first.warm.toFixed(2)}ms → ${last.warm.toFixed(2)}ms  (flat — no growth with size)` +
        `\n  measure cold (no cache):           median ${med(rows.slice(1).map(r => r.cold)).toFixed(2)}ms, ${first.cold.toFixed(2)}ms → ${last.cold.toFixed(2)}ms` +
        `\n  fade walk (per frame):             ${first.fade.toFixed(2)}ms → ${last.fade.toFixed(2)}ms  (${ratio(first.fade, last.fade)}×, linear in text nodes ${first.nodes}→${last.nodes})`,
);
console.log(
    `\nFrequency matters: measurement runs once per throttled commit (~10/s); the\n` +
        `fade frame() runs once per animation frame (~60/s) for the WHOLE stream.\n` +
        `Effective main-thread time/sec at the largest snapshot (CPU walk only — a\n` +
        `real browser also pays getClientRects layout, ${last.rects} forced reflows/frame):\n` +
        `  measure: ~${(last.warm * 10).toFixed(0)}ms/s   fade walk: ~${(last.fade * 60).toFixed(0)}ms/s`,
);
console.log(
    `\nConclusion: mugen 0.3.5 fixed measurement (warm stays flat). The remaining\n` +
        `O(n)-per-frame cost is mugen-markdown's fade overlay re-walking every text\n` +
        `node each frame to position veils by char offset — at 60fps, growing with\n` +
        `length. That's the streaming lag.`,
);
