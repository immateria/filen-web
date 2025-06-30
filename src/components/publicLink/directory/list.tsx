import { memo, useMemo, useCallback } from "react"
import { type DriveCloudItem } from "@/components/drive"
import useWindowSize from "@/hooks/useWindowSize"
import { useLocalStorage } from "@uidotdev/usehooks"
import { type DriveSortBy } from "@/components/drive/list/header"
import { DESKTOP_TOPBAR_HEIGHT } from "@/constants"
import ListItem from "@/components/drive/list/item"
import { FileListView } from "@/components/fileBrowser"

export const List = memo(({ items, parent, showSkeletons }: { items: DriveCloudItem[]; parent: string; showSkeletons: boolean }) => {
	const windowSize = useWindowSize()
	const [driveSortBy] = useLocalStorage<DriveSortBy>("driveSortBy", {})

	const getItemKey = useCallback(
		(_: number, item: DriveCloudItem) => `${item.uuid}:${driveSortBy[parent] ?? "nameAsc"}`,
		[driveSortBy, parent]
	)

	const itemContent = useCallback((index: number, item: DriveCloudItem) => {
		return (
			<ListItem
				item={item}
				index={index}
				type="list"
			/>
		)
	}, [])

	const virtuosoHeight = useMemo(() => {
		return windowSize.height - 48 - 40 - DESKTOP_TOPBAR_HEIGHT
	}, [windowSize.height])

        return (
                <FileListView
                        items={items}
                        showSkeletons={showSkeletons}
                        height={virtuosoHeight}
                        getItemKey={getItemKey}
                        itemContent={itemContent}
                />
        )
})

export default List
