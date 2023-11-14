"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { toast } from "sonner";
import { useResizeDetector } from "react-resize-detector";

interface FullscreenProps {
	url: string;
}

const Fullscreen = ({ url }: FullscreenProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [pages, setPages] = useState<number>(0);
	const { width, ref } = useResizeDetector();
	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setIsOpen(isOpen);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					aria-label="fullscreen"
					variant="ghost"
					size="sm"
					className="gap-1.5"
					onClick={() => setIsOpen(true)}
				>
					<Expand className="h-3.5 w-3.5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-7xl w-full">
				<SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
					<div ref={ref}>
						<Document
							loading={
								<div className="flex justify-center">
									<Loader2 className="my-24 h-6 w-6 animate-spin" />
								</div>
							}
							onLoadError={() => {
								toast.error("PDF 로딩 중에 문제가 발생했어요. 다시 시도해주세요.");
							}}
							onLoadSuccess={({ numPages }) => setPages(numPages)}
							file={url}
							className="min-h-full"
						>
							{new Array(pages).fill(0).map((_, idx) => (
								<Page width={width || 1} pageNumber={idx + 1} key={idx} />
							))}
						</Document>
					</div>
				</SimpleBar>
			</DialogContent>
		</Dialog>
	);
};

export default Fullscreen;
