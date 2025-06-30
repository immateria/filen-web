import { memo, useMemo, useCallback, Fragment } from "react"
import { type DriveCloudItem } from ".."
import { DESKTOP_TOPBAR_HEIGHT } from "@/constants"
import useWindowSize from "@/hooks/useWindowSize"
import ListItem from "./item"
import ContextMenu from "./contextMenu"
import useCanUpload from "@/hooks/useCanUpload"
import { FileGridView } from "@/components/fileBrowser"

export const Grid = memo(({ items, showSkeletons }: { items: DriveCloudItem[]; showSkeletons: boolean }) => {
        const windowSize = useWindowSize()
        const canUpload = useCanUpload()

	const height = useMemo(() => {
		return windowSize.height - 48 - DESKTOP_TOPBAR_HEIGHT
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

        const ContextMenuComponent = useMemo(() => {
                if (canUpload) {
                        return ContextMenu
                }

		return Fragment
	}, [canUpload])

        return (
                <ContextMenuComponent>
                        <FileGridView
                                items={items}
                                showSkeletons={showSkeletons}
                                height={height}
                                getItemKey={getItemKey}
                                itemContent={itemContent}
                        />
                </ContextMenuComponent>
        )
})

export default Grid
