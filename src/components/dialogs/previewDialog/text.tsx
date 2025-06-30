import { memo, useMemo, useState, useEffect } from "react"
import { type DriveCloudItem } from "@/components/drive"
import { fileNameToPreviewType } from "./utils"
import useWindowSize from "@/hooks/useWindowSize"
import TextEditor from "@/components/textEditor"
import { cn } from "@/lib/utils"
import { usePublicLinkURLState } from "@/hooks/usePublicLink"
import useIsMobile from "@/hooks/useIsMobile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { langNames } from "@uiw/codemirror-extensions-langs"

const textDecoder = new TextDecoder()

export const Text = memo(
	({
		buffer,
		item,
		onValueChange,
		readOnly
        }: {
                buffer: Buffer
                item: DriveCloudItem
                onValueChange?: (value: string) => void
                readOnly: boolean
        }) => {
                const [value, setValue] = useState<string>(textDecoder.decode(buffer))
                const [language, setLanguage] = useState<string | undefined>()
                const windowSize = useWindowSize()
                const publicLinkURLState = usePublicLinkURLState()
                const isMobile = useIsMobile()

                useEffect(() => {
                        setValue(textDecoder.decode(buffer))
                }, [buffer])

		const previewType = useMemo(() => {
			return fileNameToPreviewType(item.name)
		}, [item.name])

                const height = useMemo(() => {
                        if (!publicLinkURLState.isPublicLink) {
                                return windowSize.height - 48
                        }

                        return publicLinkURLState.chatEmbed ? windowSize.height : windowSize.height - 56
                }, [windowSize.height, publicLinkURLState.isPublicLink, publicLinkURLState.chatEmbed])

                return (
                        <div
                                className={cn(
                                        "flex flex-row w-full",
                                        publicLinkURLState.isPublicLink
                                                ? publicLinkURLState.chatEmbed
                                                        ? "h-[100dvh]"
                                                        : "h-[calc(100dvh-56px)]"
                                                : "h-[calc(100dvh-48px)]"
                                )}
                        >
                                <div className="absolute top-1 right-1 z-50 w-36">
                                        <Select value={language ?? "auto"} onValueChange={v => setLanguage(v === "auto" ? undefined : v)}>
                                                <SelectTrigger className="h-7 text-xs">
                                                        <SelectValue placeholder="auto" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60">
                                                        <SelectItem value="auto">auto</SelectItem>
                                                        {langNames.map(name => (
                                                                <SelectItem key={name} value={name}>
                                                                        {name}
                                                                </SelectItem>
                                                        ))}
                                                </SelectContent>
                                        </Select>
                                </div>
                                <TextEditor
                                        fileName={item.name}
                                        value={value}
                                        setValue={setValue}
                                        height={height}
                                        type={previewType === "code" || previewType === "md" ? "code" : "text"}
                                        showMarkdownPreview={previewType === "md"}
                                        onValueChange={onValueChange}
                                        autoFocus={!isMobile}
                                        readOnly={readOnly}
                                        language={language}
                                />
                        </div>
                )
        }
)

export default Text
