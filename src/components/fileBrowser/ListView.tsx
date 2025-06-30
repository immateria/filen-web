import { memo, useMemo } from "react"
import { Virtuoso, type ScrollSeekConfiguration } from "react-virtuoso"
import { Skeleton } from "@/components/ui/skeleton"
import Empty from "@/components/drive/list/empty"
import type { DriveCloudItem } from "@/components/drive"

export interface FileListViewProps {
    items: DriveCloudItem[]
    showSkeletons: boolean
    height: number
    getItemKey: (index: number, item: DriveCloudItem) => string
    itemContent: (index: number, item: DriveCloudItem) => React.ReactElement
    defaultItemHeight?: number
    fixedItemHeight?: number
    overscan?: number | { main: number; reverse: number }
    scrollSeekConfiguration?: false | ScrollSeekConfiguration
    style?: React.CSSProperties
}

export const FileListView = memo(
    ({
        items,
        showSkeletons,
        height,
        getItemKey,
        itemContent,
        defaultItemHeight = 44,
        fixedItemHeight = 44,
        overscan,
        scrollSeekConfiguration,
        style
    }: FileListViewProps) => {
    const components = useMemo(() => {
        return {
            EmptyPlaceholder: () => (
                <div className="flex flex-col w-full h-full overflow-hidden py-3">
                    {showSkeletons ? (
                        new Array(100).fill(1).map((_, index) => (
                            <div key={index} className="flex flex-row h-11 gap-3 items-center px-3 mb-3">
                                <Skeleton className="w-7 h-7 rounded-md shrink-0" />
                                <Skeleton className="grow rounded-md h-6" />
                                <Skeleton className="rounded-md h-6 w-[125px]" />
                                <Skeleton className="rounded-md h-6 w-[250px]" />
                            </div>
                        ))
                    ) : (
                        <Empty />
                    )}
                </div>
            )
        }
    }, [showSkeletons])

    const computedStyle = useMemo((): React.CSSProperties => {
        return {
            overflowX: "hidden",
            overflowY: "auto",
            height: height + "px",
            width: "100%",
            ...style
        }
    }, [height, style])

    return (
        <Virtuoso
            data={items}
            totalCount={items.length}
            height={height}
            width="100%"
            computeItemKey={getItemKey}
            defaultItemHeight={defaultItemHeight}
            fixedItemHeight={fixedItemHeight}
            itemContent={itemContent}
            components={components}
            id="virtuoso-drive-list"
            style={computedStyle}
            overscan={overscan}
            scrollSeekConfiguration={scrollSeekConfiguration}
        />
    )
})

export default FileListView
