export default function PoolCueStick({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 20"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cueWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8c48a" />
          <stop offset="0.45" stopColor="#c89355" />
          <stop offset="0.55" stopColor="#c89355" />
          <stop offset="1" stopColor="#8f5f2d" />
        </linearGradient>
      </defs>
      {/* butt cap */}
      <rect x="2" y="3" width="16" height="14" rx="2" fill="#1a1a1a" />
      <rect x="16" y="4" width="8" height="12" fill="#5c3a1e" />
      {/* tapered shaft */}
      <path d="M24 5 L296 8.3 L296 11.7 L24 15 Z" fill="url(#cueWood)" />
      {/* ferrule */}
      <rect x="296" y="8.5" width="10" height="3" fill="#f3ead9" />
      {/* tip */}
      <rect x="306" y="8.8" width="8" height="2.4" rx="1.2" fill="#6ea3d8" />
    </svg>
  );
}
