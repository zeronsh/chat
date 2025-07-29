import * as React from 'react';
import type { SVGProps } from 'react';

export default function ZaiIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 2000 1700"
            fill="currentColor"
            className="h-full w-full"
            {...props}
        >
            <polygon points="1008.73 0 827.29 251.03 54.43 251.03 235.74 0 1008.73 0"></polygon>
            <polygon points="1937.79 1449.1 1756.47 1700 986.3 1700 1167.48 1449.1 1937.79 1449.1"></polygon>
            <polygon points="2000 0 771.98 1700 0 1700 1228.02 0 2000 0"></polygon>
        </svg>
    );
}
