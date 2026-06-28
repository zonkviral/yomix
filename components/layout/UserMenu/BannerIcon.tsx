// 2 — Hanko seal & ink wash
export const BannerIcon = () => (
    <svg
        viewBox="0 0 240 84"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
    >
        <rect width="240" height="84" fill="#0d0d0d" />

        <ellipse cx="20" cy="88" rx="80" ry="42" fill="#1c0f14" opacity="0.8" />
        <ellipse cx="40" cy="80" rx="55" ry="30" fill="#240c14" opacity="0.7" />
        <ellipse
            cx="200"
            cy="-6"
            rx="60"
            ry="30"
            fill="#170a0e"
            opacity="0.7"
        />

        <g transform="translate(206, 20)">
            <circle r="13" fill="none" stroke="#e11d48" strokeWidth="1.4" />
            <circle r="10" fill="none" stroke="#e11d48" strokeWidth="0.5" />
            <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fill="#e11d48"
                fontFamily="serif"
            >
                読
            </text>
        </g>

        <line
            x1="0"
            y1="83"
            x2="240"
            y2="83"
            stroke="#e11d48"
            strokeWidth="1"
            opacity="0.45"
        />
    </svg>
)
