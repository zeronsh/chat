import { useCallback, useEffect, useRef, useState } from 'react';

interface UseResizableOptions {
    initialWidth: number;
    minWidth?: number;
    maxWidth?: number;
    storageKey?: string;
    onResize?: (width: number) => void;
}

export function useResizable({
    initialWidth,
    minWidth = 200,
    maxWidth = 600,
    storageKey,
    onResize,
}: UseResizableOptions) {
    const [width, setWidth] = useState(() => {
        if (storageKey && typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsedWidth = parseInt(saved, 10);
                if (!isNaN(parsedWidth) && parsedWidth >= minWidth && parsedWidth <= maxWidth) {
                    return parsedWidth;
                }
            }
        }
        return initialWidth;
    });
    const [isResizing, setIsResizing] = useState(false);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = width;
    }, [width]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = startXRef.current - e.clientX; // For right sidebar, moving left decreases width
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
        
        setWidth(newWidth);
        onResize?.(newWidth);
        
        if (storageKey) {
            localStorage.setItem(storageKey, newWidth.toString());
        }
    }, [isResizing, minWidth, maxWidth, onResize, storageKey]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isResizing, handleMouseMove, handleMouseUp]);

    return {
        width,
        isResizing,
        handleMouseDown,
    };
}