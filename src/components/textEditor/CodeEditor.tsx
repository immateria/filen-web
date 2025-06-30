import { memo, useCallback, useMemo, useEffect, useRef } from "react"
import { useTheme } from "@/providers/themeProvider"
import * as themes from "./theme"
import { loadLanguage } from "./langs"
import { loadLanguage as loadLanguageByName, type LanguageName } from "@uiw/codemirror-extensions-langs"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { color } from "@uiw/codemirror-extensions-color"
import CodeMirror, { EditorView, type ReactCodeMirrorRef } from "@uiw/react-codemirror"

export interface CodeEditorProps {
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
	onBlur?: () => void
        maxLength?: number
        className?: string
        language?: string
}

export const CodeEditor = memo(
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
		onBlur,
               maxLength,
               className,
               language
       }: CodeEditorProps) => {
		const codeMirrorRef = useRef<ReactCodeMirrorRef>(null)
		const { dark } = useTheme()

		const onChange = useCallback(
			(val: string) => {
				if (maxLength && val.length >= maxLength) {
					val = val.slice(0, maxLength)
				}

				setValue(val)

				if (onValueChange) {
					onValueChange(val)
				}
			},
			[onValueChange, setValue, maxLength]
		)

		const editorTheme = useMemo(() => {
			return dark ? themes.dark : themes.light
		}, [dark])

               const langExtension = useMemo(() => {
               const lang = language ? loadLanguageByName(language as LanguageName) : loadLanguage(fileName)

                       if (!lang) {
                               return []
                       }

                       return [lang]
               }, [fileName, language])

		const extensions = useMemo(() => {
			return type === "code"
				? [
						...langExtension,
						hyperLink,
						color,
						EditorView.lineWrapping,
						EditorView.theme({
							"&": {
								fontFamily: "Menlo, Monaco, Lucida Console, monospace"
							},
							".cm-content": {
								padding: "0px"
							}
						})
					]
				: [
						EditorView.lineWrapping,
						EditorView.theme({
							".cm-content": {
								padding: "10px",
								paddingTop: "13px"
							}
						})
					]
		}, [type, langExtension])

		const onCreateEditor = useCallback((view: EditorView) => {
			view.dispatch({
				scrollIntoView: true
			})
		}, [])

		useEffect(() => {
			codeMirrorRef.current?.view?.dispatch({
				scrollIntoView: true
			})
		}, [])

		return (
			<CodeMirror
				ref={codeMirrorRef}
				value={value}
				onChange={onChange}
				height={height + "px"}
				maxHeight={height + "px"}
				minHeight={height + "px"}
				width="100%"
				maxWidth="100%"
				minWidth="100%"
				theme={editorTheme}
				extensions={extensions}
				indentWithTab={indentWithTab}
				editable={editable}
				autoFocus={autoFocus}
				readOnly={readOnly}
				placeholder={placeholder}
				onBlur={onBlur}
				onCreateEditor={onCreateEditor}
				className={className}
				basicSetup={{
					lineNumbers: type === "code",
					searchKeymap: type === "code",
					tabSize: 4,
					highlightActiveLine: type === "code",
					highlightActiveLineGutter: type === "code",
					foldGutter: type === "code",
					foldKeymap: type === "code",
					syntaxHighlighting: type === "code"
				}}
				style={{
					height,
					minHeight: height,
					maxHeight: height,
					width: "100%",
					minWidth: "100%",
					maxWidth: "100%"
				}}
			/>
		)
	}
)

export default CodeEditor
