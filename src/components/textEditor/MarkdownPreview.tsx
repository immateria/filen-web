import { memo, useCallback, useMemo } from "react"
import Markdown, { type ExtraProps } from "react-markdown"
import { type Element, type Root } from "hast"
import gfm from "remark-gfm"
import { remarkAlert } from "remark-github-blockquote-alert"
import { cn } from "@/lib/utils"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeExternalLinks from "rehype-external-links"
import { visit } from "unist-util-visit"
import { useTheme } from "@/providers/themeProvider"
import "./markdownStyle.less"

export interface MarkdownPreviewProps {
	value: string
	className?: string
}

export const MarkdownPreview = memo(({ value, className }: MarkdownPreviewProps) => {
	const { dark } = useTheme()

	const markdownComponents = useMemo(() => {
		return {
			code(props: React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & ExtraProps) {
				try {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { children, className, node, ...rest } = props
					const match = /language-(\w+)/.exec(className || "")

					return match ? (
						// @ts-expect-error Not typed
						<SyntaxHighlighter
							{...rest}
							PreTag="div"
							children={String(children).replace(/\n$/, "")}
							language={match?.[1] ?? "bash"}
							style={dark ? oneDark : oneLight}
						/>
					) : (
						<code
							{...rest}
							className={className}
						>
							{children}
						</code>
					)
				} catch (e) {
					console.error(e)
				}
			}
		}
	}, [dark])

	const markdownAllowElement = useCallback((element: Element) => {
		if (!element.tagName) {
			return
		}

		return /^[A-Za-z0-9]+$/.test(element.tagName)
	}, [])

	const markdownRehypeRewriteLinks = useCallback(() => {
		return (tree: Root) => {
			visit(tree, "element", node => {
				if (node.tagName === "a") {
					if (!node.properties) {
						node.properties = {}
					}

					if (typeof node.properties.href === "string" && node.properties.href.startsWith("http")) {
						return
					}

					node.properties.href = window.location.href
				}
			})
		}
	}, [])

	return (
		<Markdown
			children={value}
			className={cn(
				"markdown-content wmde-markdown wmde-markdown-color w-full h-full bg-transparent overflow-auto pb-12 px-4 pt-4",
				dark ? "text-white" : "text-black",
				className
			)}
			skipHtml={true}
			remarkPlugins={[remarkAlert, gfm]}
			rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }], markdownRehypeRewriteLinks]}
			allowElement={markdownAllowElement}
			components={markdownComponents}
		/>
	)
})

export default MarkdownPreview
