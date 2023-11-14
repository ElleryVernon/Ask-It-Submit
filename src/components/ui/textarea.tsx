import * as React from "react";

import { cn } from "@/lib/utils";
import TextareaAutoSize, { TextareaAutosizeProps } from "react-textarea-autosize";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
	({ className, ...props }, ref) => {
		return (
			<TextareaAutoSize
				className={cn(
					"flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Textarea.displayName = "Textarea";

export { Textarea };
