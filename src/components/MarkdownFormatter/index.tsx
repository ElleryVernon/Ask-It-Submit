import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import CodeBlock from "./CodeBlock";

interface MarkdownMessageProps {
	children: string;
}

const MarkdownFormatter = ({ children }: MarkdownMessageProps) => {
	return (
		<ReactMarkdown
			className="prose mt-1 w-full 
			break-words overflow-x-scroll prose-p:leading-relaxed text-[13px] leading-[26px] sm:leading-7 sm:text-[15px] text-black"
			remarkPlugins={[remarkGfm, remarkBreaks]}
			components={{
				a: (props) => (
					<a
						{...props}
						target="_blank"
						rel="noopener noreferrer"
						className="font-semibold text-blue-600 underline"
					/>
				),
				code({ node, inline, className, children, ...props }) {
					if (children.length) {
						if (children[0] == "▍") {
							return <span className="mt-1 animate-pulse cursor-default">▍</span>;
						}

						children[0] = (children[0] as string).replace("`▍`", "▍");
					}

					const match = /language-(\w+)/.exec(className || "");

					if (inline) {
						return (
							<code {...props} className={className + "text-black font-semibold"}>
								`{children}`
							</code>
						);
					}
					return (
						<CodeBlock
							key={Math.random()}
							language={(match && match[1]) || ""}
							value={String(children)}
							props={props}
						/>
					);
				},
				p: (props) => <p {...props} className="mb-[16px] sm:mb-[20px]" />,
				ul: ({ ordered, ...props }) => (
					<ul {...props} className="list-disc pl-5 space-y-2 mb-[16px] sm:mb-[20px]" />
				),
				ol: ({ ordered, ...props }) => (
					<ol {...props} className="list-decimal pl-5 space-y-2 mb-[16px] sm:mb-[20px]" />
				),
				li: (props) => <li {...props} className="leading-6" />,
			}}
		>
			{String(children)}
		</ReactMarkdown>
	);
};

export default MarkdownFormatter;
