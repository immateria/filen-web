import { memo, useMemo, useCallback } from "react"
import useWindowSize from "@/hooks/useWindowSize"
import { IS_DESKTOP, DESKTOP_TOPBAR_HEIGHT } from "@/constants"
import { type DriveCloudItem } from "@/components/drive"
import ListItem from "@/components/drive/list/item"
import { FileGridView } from "@/components/fileBrowser"

export const Grid = memo(({ items, showSkeletons }: { items: DriveCloudItem[]; showSkeletons: boolean }) => {
        const windowSize = useWindowSize()

	const height = useMemo(() => {
		return IS_DESKTOP ? windowSize.height - 48 - DESKTOP_TOPBAR_HEIGHT : windowSize.height - 48
	}, [windowSize.height])

        const getItemKey = useCallback((_: number, item: DriveCloudItem) => item.uuid, [])

	const itemContent = useCallback((index: number, item: DriveCloudItem) => {
		return (
			<ListItem
				item={item}
				index={index}
				type="grid"
			/>
		)
	}, [])

        return (
                <FileGridView
                        items={items}
                        showSkeletons={showSkeletons}
                        height={height}
                        getItemKey={getItemKey}
                        itemContent={itemContent}
                />
        )
})

export default Grid
