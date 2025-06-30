import { memo } from "react"
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "../ui/resizable"
import { useLocalStorage } from "@uidotdev/usehooks"
import { usePublicLinkURLState } from "@/hooks/usePublicLink"
import useLocation from "@/hooks/useLocation"
import CodeEditor from "./CodeEditor"
import MarkdownPreview from "./MarkdownPreview"
import CharCounter from "./CharCounter"

export const TextEditor = memo(
        ({
                value,
                setValue,
                fileName,
                height,
                onValueChange,
                editable,
                autoFocus,
                indentWithTab,
                type,
                readOnly,
                placeholder,
                showMarkdownPreview,
                onBlur,
                maxLength,
                showCharCount,
                language
        }: {
                value: string
                setValue: React.Dispatch<React.SetStateAction<string>>
                fileName: string
                height: number
                onValueChange?: (value: string) => void
		editable?: boolean
		autoFocus?: boolean
		indentWithTab?: boolean
		type: "code" | "text"
		readOnly?: boolean
                placeholder?: string
                showMarkdownPreview?: boolean
                onBlur?: () => void
                maxLength?: number
                showCharCount?: boolean
                language?: string
        }) => {
		const publicLinkURLState = usePublicLinkURLState()
		const location = useLocation()
		const [resizablePanelSizes, setResizablePanelSizes] = useLocalStorage<number[]>(
			location.includes("notes")
				? "textEditorResizablePanelSizes:notes"
				: publicLinkURLState.isPublicLink
					? "textEditorResizablePanelSizes:publicLink"
					: "textEditorResizablePanelSizes",
			[50, 50]
		)

                return (
                        <div className="relative flex flex-row w-full h-full">
                                <ResizablePanelGroup
                                        direction="horizontal"
                                        onLayout={setResizablePanelSizes}
                                >
					<ResizablePanel
						defaultSize={resizablePanelSizes[0]}
						minSize={20}
						maxSize={80}
						order={1}
						className={type === "code" ? "font-mono" : undefined}
					>
                                                <CodeEditor
                                                        value={value}
                                                        setValue={setValue}
                                                        fileName={fileName}
                                                        height={height}
                                                        onValueChange={onValueChange}
                                                        editable={editable}
                                                        autoFocus={autoFocus}
                                                        indentWithTab={indentWithTab}
                                                        type={type}
                                                        readOnly={readOnly}
                                                        placeholder={placeholder}
                                                        onBlur={onBlur}
                                                        maxLength={maxLength}
                                                        language={language}
                                                />
					</ResizablePanel>
					{showMarkdownPreview && (
						<>
							<ResizableHandle
								className="bg-transparent w-0"
								withHandle={true}
							/>
							<ResizablePanel
								defaultSize={resizablePanelSizes[1]}
								minSize={20}
								maxSize={80}
								order={2}
								className="border-l"
							>
								<MarkdownPreview value={value} />
							</ResizablePanel>
						</>
                                        )}
                                </ResizablePanelGroup>
                                {showCharCount && (
                                        <CharCounter value={value} maxLength={maxLength} />
                                )}
                        </div>
                )
        }
)

export { default as CodeEditor } from "./CodeEditor"
export { default as MarkdownPreview } from "./MarkdownPreview"
export { default as CharCounter } from "./CharCounter"
export default TextEditor
