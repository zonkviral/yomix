export const Noise = ({ opacity = 0.04 }: { opacity?: number }) => {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
                opacity,
                backgroundRepeat: "repeat",
                backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")`,
            }}
        />
    )
}
