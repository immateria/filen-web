import { memo, useMemo } from "react"
import { Virtuoso } from "react-virtuoso"
import { ArrowDownUp } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { Transfer } from "@/stores/transfers.store"

const EmptyPlaceholder = () => {
    const { t } = useTranslation()

    return (
        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <ArrowDownUp size={60} />
            <p>{t("transfers.noActiveTransfers")}</p>
        </div>
    )
}

export interface TransferListViewProps {
    transfers: Transfer[]
    height: number
    getItemKey: (index: number, transfer: Transfer) => string
    itemContent: (index: number, transfer: Transfer) => React.ReactElement
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
    overscan?: number | { main: number; reverse: number }
    style?: React.CSSProperties
}

export const TransferListView = memo(
    ({
        transfers,
        height,
        getItemKey,
        itemContent,
        onDragOver,
        overscan = 0,
        style
    }: TransferListViewProps) => {
        const components = useMemo(() => {
            return {
                EmptyPlaceholder
            }
        }, [])

        const computedStyle = useMemo((): React.CSSProperties => {
            return {
                overflowX: "hidden",
                overflowY: "auto",
                width: "100%",
                ...style
            }
        }, [style])

        return (
            <Virtuoso
                data={transfers}
                totalCount={transfers.length}
                height={height}
                width="100%"
                computeItemKey={getItemKey}
                itemContent={itemContent}
                onDragOver={onDragOver}
                defaultItemHeight={78}
                components={components}
                overscan={overscan}
                style={computedStyle}
            />
        )
    }
)

TransferListView.displayName = "TransferListView"

export default TransferListView
