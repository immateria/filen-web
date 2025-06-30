import { memo } from "react"

export interface CharCounterProps {
    value: string
    maxLength?: number
    className?: string
}

const CharCounter = memo(({ value, maxLength, className }: CharCounterProps) => {
    return (
        <p className={className ?? "absolute bottom-2 right-2 text-xs text-muted-foreground"}>
            {value.length}
            {typeof maxLength === "number" ? `/${maxLength}` : ""}
        </p>
    )
})

export default CharCounter
