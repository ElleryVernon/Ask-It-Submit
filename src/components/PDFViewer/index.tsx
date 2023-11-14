"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, RotateCw, Search } from "lucide-react";
import { toast } from "sonner";

import { useResizeDetector } from "react-resize-detector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "../ui/dropdown-menu";
import SimpleBar from "simplebar-react";
import Fullscreen from "./Fullscreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFVierProps {
	url: string;
}

const PDFViewer = ({ url }: PDFVierProps) => {
	const { width, ref } = useResizeDetector();
	const [pages, setPages] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [scale, setScale] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const [renderScale, setRenderScale] = useState<number | null>(null);

	const isLoading = renderScale !== scale;

	const pageValidator = z.object({
		page: z.string().refine((num) => Number(num) > 0 && Number(num) <= pages),
	});

	type TPageValidator = z.infer<typeof pageValidator>;

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<TPageValidator>({
		defaultValues: {
			page: "1",
		},
		resolver: zodResolver(pageValidator),
	});

	const handlePageSubmit = ({ page }: TPageValidator) => {
		setCurrentPage(Number(page));
		setValue("page", String(page));
	};

	useEffect(() => {
		if (currentPage && errors.page) {
			toast.error("페이지 번호를 다시 확인해주세요");
		}
	}, [errors.page]);
	return (
		<div
			className="
                w-full 
                bg-white 
                rounded-xl 
                shadow
                flex 
                flex-col 
                items-center
            "
		>
			<div
				className="
                    h-[52px]
                    w-full
                    border-b
                    border-zinc-200
                    flex
                    items-center
                    justify-between
					px-1
                    sm:px-2
                "
			>
				<div className="space-x-1">
					<Button
						variant="ghost"
						size="sm"
						aria-label="rotste-90-degrees"
						onClick={() => setRotation((prev) => prev + 90)}
					>
						<RotateCw className="h-3.5 w-3.5" />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button aria-label="zoom" variant="ghost" size="sm" className="gap-1.5">
								<Search className="h-3.5 w-3.5" />
								{scale * 100}%
								<ChevronDown className="h-3 w-3 opacity-60" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onSelect={() => setScale(1)}>100%</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(1.5)}>150%</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2)}>200%</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2.5)}>250%</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div
					className="
                        flex
                        items-center
                        gap-1
                    "
				>
					<Button
						disabled={currentPage === 1}
						variant="ghost"
						size="sm"
						aria-label="privious-page"
						onClick={() => {
							const newPage = currentPage > 1 ? currentPage - 1 : currentPage;
							setCurrentPage(newPage);
							setValue("page", String(newPage), { shouldValidate: true });
						}}
					>
						<ChevronLeft className="h-3.5 w-3.5" />
					</Button>
					<div className="flex items-center gap-1">
						<Input
							{...register("page")}
							className={cn("w-12 h-7", errors.page && "focus-visible:ring-red-500")}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSubmit(handlePageSubmit)();
								}
							}}
						/>
						<p className="text-neutral-700 text-sm space-x-1">
							<span>/</span>
							<span>{pages}</span>
						</p>
					</div>
					<Button
						disabled={currentPage === pages}
						variant="ghost"
						aria-label="next-page"
						size="sm"
						onClick={() => {
							const newPage = currentPage < pages ? currentPage + 1 : currentPage;
							setCurrentPage(newPage);
							setValue("page", String(newPage), { shouldValidate: true });
						}}
					>
						<ChevronRight className="h-3.5 w-3.5" />
					</Button>

					<Fullscreen url={url} />
				</div>
			</div>
			<div className="flex-1 w-full max-h-[87vh]">
				<SimpleBar autoHide={false} className="max-h-[87vh]">
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
							{isLoading && renderScale ? (
								<Page
									width={width || 1}
									pageNumber={currentPage}
									scale={scale}
									rotate={rotation}
									key={"@" + renderScale}
								/>
							) : null}

							<Page
								className={cn(isLoading && "hidden")}
								width={width || 1}
								pageNumber={currentPage}
								scale={scale}
								rotate={rotation}
								key={"@" + scale}
								loading={
									<div className="flex justify-center">
										<Loader2 className="my-24 h-6 w-6 animate-spin" />
									</div>
								}
								onRenderSuccess={() => setRenderScale(scale)}
							/>
						</Document>
					</div>
				</SimpleBar>
			</div>
		</div>
	);
};

export default PDFViewer;
