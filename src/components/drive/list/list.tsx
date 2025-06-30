import { memo, useMemo, useCallback, Fragment } from "react"
import { IS_DESKTOP, DESKTOP_TOPBAR_HEIGHT } from "@/constants"
import useWindowSize from "@/hooks/useWindowSize"
import ListItem from "./item"
import ContextMenu from "./contextMenu"
import { type DriveCloudItem } from ".."
import { useLocalStorage } from "@uidotdev/usehooks"
import Header, { type DriveSortBy } from "./header"
import useRouteParent from "@/hooks/useRouteParent"
import useCanUpload from "@/hooks/useCanUpload"
import { FileListView } from "@/components/fileBrowser"

export const List = memo(({ items, showSkeletons }: { items: DriveCloudItem[]; showSkeletons: boolean }) => {
	const windowSize = useWindowSize()
	const routeParent = useRouteParent()
	const [driveSortBy] = useLocalStorage<DriveSortBy>("driveSortBy", {})
	const canUpload = useCanUpload()

	const virtuosoHeight = useMemo(() => {
		return IS_DESKTOP
			? windowSize.height - 48 - (showSkeletons ? 0 : 32) - DESKTOP_TOPBAR_HEIGHT
			: windowSize.height - 48 - (showSkeletons ? 0 : 32)
	}, [windowSize.height, showSkeletons])

	const getItemKey = useCallback(
		(_: number, item: DriveCloudItem) => `${item.uuid}:${driveSortBy[routeParent] ?? "nameAsc"}`,
		[driveSortBy, routeParent]
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

        const ContextMenuComponent = useMemo(() => {
                if (canUpload) {
                        return ContextMenu
                }

		return Fragment
	}, [canUpload])

        return (
                <>
                        {items.length > 0 && <Header />}
                        <ContextMenuComponent>
                                <FileListView
                                        items={items}
                                        showSkeletons={showSkeletons}
                                        height={virtuosoHeight}
                                        getItemKey={getItemKey}
                                        itemContent={itemContent}
                                />
                        </ContextMenuComponent>
                </>
        )
})

export default List
