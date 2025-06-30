import { memo, useMemo } from "react"

export const HexViewer = memo(
    ({
        buffer,
        offset = 0,
        onNext,
        onPrev,
        hasNext,
        hasPrev
    }: {
        buffer: Buffer
        offset?: number
        onNext?: () => void
        onPrev?: () => void
        hasNext?: boolean
        hasPrev?: boolean
    }) => {
        const validBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.alloc(0)

        const rows = useMemo(() => {
            const result: string[] = []
            const addrWidth = Math.max(8, (offset + validBuffer.length - 1).toString(16).length)

            for (let i = 0; i < validBuffer.length; i += 16) {
                const chunk = validBuffer.subarray(i, i + 16)
                const hexBytes = Array.from(chunk).map(b => b.toString(16).padStart(2, "0").toUpperCase())
                const left = hexBytes.slice(0, 8).join(" ")
                const right = hexBytes.slice(8).join(" ")
                const ascii = Array.from(chunk)
                    .map(b => (b >= 32 && b < 127 ? String.fromCharCode(b) : "."))
                    .join("")

                result.push(`${(offset + i).toString(16).padStart(addrWidth, "0")}  ${left.padEnd(8 * 3 - 1)}  ${right.padEnd(8 * 3 - 1)}  |${ascii}|`)
            }

            return result
        }, [validBuffer, offset])

        if (!Buffer.isBuffer(buffer)) {
            return (
                <div className="p-4 text-sm text-red-600">Unable to display hex content.</div>
            )
        }

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
