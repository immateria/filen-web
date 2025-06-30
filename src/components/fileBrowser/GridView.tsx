import { memo, useRef, useMemo, forwardRef, Fragment } from "react"
import { VirtuosoGrid, type VirtuosoGridHandle, type GridComponents } from "react-virtuoso"
import { Skeleton } from "@/components/ui/skeleton"
import Empty from "@/components/drive/list/empty"
import type { DriveCloudItem } from "@/components/drive"

export interface FileGridViewProps {
    items: DriveCloudItem[]
    showSkeletons: boolean
    height: number
    getItemKey: (index: number, item: DriveCloudItem) => string
    itemContent: (index: number, item: DriveCloudItem) => React.ReactElement
    ContextMenuComponent?: React.ComponentType<{ children: React.ReactNode }>
}

export const FileGridView = memo(({ items, showSkeletons, height, getItemKey, itemContent, ContextMenuComponent = Fragment }: FileGridViewProps) => {
    const virtuosoRef = useRef<VirtuosoGridHandle>(null)

    const skeletons = useMemo(() => {
        return new Array(100).fill(1).map((_, index) => (
            <div key={index} className="w-[200px] h-[200px] p-3">
                <Skeleton className="w-full h-full rounded-md" />
            </div>
        ))
    }, [])

    const components = useMemo(() => {
        return {
            Item: (props: React.HTMLAttributes<HTMLDivElement>) => (
                <div {...props} style={{ width: "200px" }} />
            ),
            List: forwardRef(({ style, children }, listRef) => (
                <div ref={listRef as React.Ref<HTMLDivElement>} style={{ display: "flex", flexWrap: "wrap", ...style }}>
                    {children}
                </div>
            ))
        } as GridComponents
    }, [])

    const style = useMemo((): React.CSSProperties => {
        return {
            overflowX: "hidden",
            overflowY: "auto",
            height: height + "px",
            width: "100%"
        }
    }, [height])

    if (showSkeletons) {
        return <div className="flex flex-row flex-wrap overflow-hidden">{skeletons}</div>
    }

    if (items.length === 0) {
        return (
            <ContextMenuComponent>
                <div style={{ height: height - 40, width: "100%" }}>
                    <Empty />
                </div>
            </ContextMenuComponent>
        )
    }

    return (
        <ContextMenuComponent>
            <VirtuosoGrid
                ref={virtuosoRef}
                totalCount={items.length}
                data={items}
                width="100%"
                height={height}
                id="virtuoso-drive-list"
                style={style}
                components={components}
                computeItemKey={getItemKey}
                itemContent={itemContent}
            />
        </ContextMenuComponent>
    )
})

export default FileGridView
