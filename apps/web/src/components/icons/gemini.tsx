import type { SVGProps } from "react";

const Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    viewBox="0 0 64 64"
    fill="currentColor"
    {...props}
  >
    <g clipPath="url(#gemini)">
      <path d="M32 64A38.14 38.14 0 0 0 0 32 38.14 38.14 0 0 0 32 0a38.15 38.15 0 0 0 32 32 38.15 38.15 0 0 0-32 32" />
    </g>
    <defs>
      <clipPath id="gemini">
        <path fill="#fff" d="M0 0h64v64H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default Icon;
