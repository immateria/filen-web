import { memo, useMemo } from "react"

export const HexViewer = memo(
    ({
        buffer,
        offset = 0,
        size,
        onNext,
        onPrev,
        hasNext,
        hasPrev
    }: {
        buffer: Buffer
        offset?: number
        size: number
        onNext?: () => void
        onPrev?: () => void
        hasNext?: boolean
        hasPrev?: boolean
    }) => {
        const rows = useMemo(() => {
            const result: string[] = []
            const addrWidth = Math.max(8, size.toString(16).length)

            for (let i = 0; i < buffer.length; i += 16) {
                const chunk = buffer.subarray(i, i + 16)
                const hexBytes = Array.from(chunk).map(b => b.toString(16).padStart(2, "0").toUpperCase())
                const left = hexBytes.slice(0, 8).join(" ")
                const right = hexBytes.slice(8).join(" ")
                const ascii = Array.from(chunk)
                    .map(b => (b >= 32 && b < 127 ? String.fromCharCode(b) : "."))
                    .join("")

                result.push(`${(offset + i).toString(16).padStart(addrWidth, "0")}  ${left.padEnd(8 * 3 - 1)}  ${right.padEnd(8 * 3 - 1)}  |${ascii}|`)
            }

            return result
        }, [buffer, offset, size])

        return (
            <div className="font-mono text-xs leading-5 p-4 overflow-auto whitespace-pre">
                <pre>{rows.join("\n")}</pre>
                <div className="flex flex-row gap-4 mt-2">
                    {hasPrev && (
                        <button className="underline" onClick={onPrev}>
                            Previous
                        </button>
                    )}
                    {hasNext && (
                        <button className="underline" onClick={onNext}>
                            Next
                        </button>
                    )}
                </div>
            </div>
        )
    }
)

export default HexViewer
