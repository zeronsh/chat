// Shared DOM + canvas mock so mugen/pretext and the fade walk can run in Node.
import { GlobalWindow } from 'happy-dom';

function define(key, value) {
    try {
        globalThis[key] = value;
    } catch {
        try {
            Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
        } catch {
            /* read-only global (navigator/performance) — Node's own is fine */
        }
    }
}

export function setupDom() {
    const win = new GlobalWindow({ width: 1024, height: 768 });
    const keys = [
        'document', 'requestAnimationFrame', 'cancelAnimationFrame', 'MutationObserver',
        'getComputedStyle', 'NodeFilter', 'Node', 'Range', 'HTMLElement', 'Element',
        'CustomEvent', 'Event', 'HTMLCanvasElement', 'OffscreenCanvas', 'DOMRect',
    ];
    for (const k of keys) if (win[k] !== undefined) define(k, win[k]);
    define('window', win);
    define('devicePixelRatio', 1);

    // pretext measures via a 2d canvas context, which happy-dom doesn't implement.
    // Provide a deterministic length-based stub: width ∝ char advance. The exact
    // widths don't matter for *timing* the walk/layout; only their shape does.
    const PER_CHAR = 7.2;
    const ctxStub = {
        font: '',
        fillStyle: '',
        globalAlpha: 1,
        measureText: s => ({ width: (s ? s.length : 0) * PER_CHAR }),
        fillText() {}, clearRect() {}, setTransform() {}, fillRect() {}, fill() {},
        save() {}, restore() {}, beginPath() {}, rect() {},
    };
    const getContext = () => ctxStub;
    if (globalThis.HTMLCanvasElement) globalThis.HTMLCanvasElement.prototype.getContext = getContext;
    if (globalThis.OffscreenCanvas) globalThis.OffscreenCanvas.prototype.getContext = getContext;
    return win;
}
