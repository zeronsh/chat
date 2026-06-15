import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Markdown } from '@wingleeio/mugen-markdown';

const THEME = { fontFamily: 'sans-serif', monoFamily: 'monospace', fontSize: 15, lineHeight: 26 };

function App() {
    const [source, setSource] = useState('');
    const [fade, setFade] = useState(true);
    window.__setSource = setSource;
    window.__setFade = setFade;
    return (
        <div style={{ width: 720, margin: '0 auto', padding: 16 }}>
            <Markdown source={source} theme={THEME} fade={fade} />
        </div>
    );
}

createRoot(document.getElementById('root')).render(<App />);

// Persistent frame-interval recorder — captures how long the main thread is
// blocked between animation frames (React render + browser layout/paint + the
// fade canvas clear/realloc all land here).
window.__frames = [];
let last = performance.now();
function rec(t) {
    window.__frames.push(t - last);
    last = t;
    requestAnimationFrame(rec);
}
requestAnimationFrame(rec);
window.__ready = true;
