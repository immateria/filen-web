import { memo, useMemo } from "react"

export const HexViewer = memo(({ buffer, onLoadMore, hasMore }: { buffer: Buffer; onLoadMore?: () => void; hasMore?: boolean }) => {
    const rows = useMemo(() => {
        const result: string[] = []
        const addrWidth = Math.max(8, buffer.length.toString(16).length)

        for (let i = 0; i < buffer.length; i += 16) {
            const chunk = buffer.subarray(i, i + 16)
            const hexBytes = Array.from(chunk).map(b => b.toString(16).padStart(2, "0").toUpperCase())
            const left = hexBytes.slice(0, 8).join(" ")
            const right = hexBytes.slice(8).join(" ")
            const ascii = Array.from(chunk)
                .map(b => (b >= 32 && b < 127 ? String.fromCharCode(b) : "."))
                .join("")

            result.push(`${i.toString(16).padStart(addrWidth, "0")}  ${left.padEnd(8 * 3 - 1)}  ${right.padEnd(8 * 3 - 1)}  |${ascii}|`)
        }

        return result
    }, [buffer])

    return (
        <div className="font-mono text-xs leading-5 p-4 overflow-auto whitespace-pre">
            <pre>{rows.join("\n")}</pre>
            {hasMore && (
                <button className="mt-2 underline" onClick={onLoadMore}>
                    Load more
                </button>
            )}
        </div>
    )
})

export default HexViewer
