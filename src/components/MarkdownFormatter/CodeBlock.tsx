"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";

interface CodeBlockProps {
	language: string;
	value: string;
	props: any;
}

export default function CodeBlock({ language, value, props }: CodeBlockProps) {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			toast.success("코드가 복사되었습니다.");
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};
	return (
		<div className="relative w-full bg-zinc-950 font-sans mb-[14px] sm:mb-[20px] rounded-md">
			<div className="flex w-full items-center justify-between bg-zinc-700 px-7 text-zinc-100 py-1 rounded-t-md">
				<span className="text-[11px] lowercase">{language}</span>
				<button
					onClick={(e: React.MouseEvent) => {
						handleCopy();
						e.preventDefault();
					}}
					className="flex"
				>
					<Clipboard className="h-[13px] w-[13px] sm:h-[15px] sm:w-[15px] text-gray-200" />
				</button>
			</div>
			<SyntaxHighlighter
				{...props}
				language={language || "markdown"}
				style={{ ...oneDark }}
				showLineNumbers
				customStyle={{
					margin: 0,
					width: "100%",
					padding: "1.5rem 1rem",
					background: "black",
					overflowX: "scroll",
				}}
				codeTagProps={{
					style: {
						fontSize: "0.85rem",
						fontFamily: "var(--font-mono)",
					},
				}}
				PreTag="div"
			>
				{value.trimEnd()}
			</SyntaxHighlighter>
		</div>
	);
}
