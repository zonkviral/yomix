export const Highlight = ({ text, query }: { text: string; query: string }) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx < 0) return <span>{text}</span>
    return (
        <span>
            {text.slice(0, idx)}
            <span className="text-amber-400">
                {text.slice(idx, idx + query.length)}
            </span>
            {text.slice(idx + query.length)}
        </span>
    )
}
