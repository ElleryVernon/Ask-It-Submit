"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import Dropzone from "react-dropzone";
import { Upload, File, FileWarning } from "lucide-react";
import { Progress } from "../ui/progress";
import { supabase } from "@/supabase";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

const FileDropzone = () => {
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [isError, setIsError] = useState<boolean>(false);

	const { mutate: insertFile } = trpc.insertFile.useMutation({
		onSuccess: (file) => {
			router.push(`/dashboard/${file.id}`);
		},
		retry: true,
		retryDelay: 400,
	});

	useEffect(() => {
		if (isProcessing && progress === 100) {
			toast.loading("거의 다 준비되었어요!");
		}
	}, [isProcessing, progress]);

	const simulatedProgres = () => {
		setProgress(0);
		setIsProcessing(true);

		const interval = setInterval(() => {
			setProgress((prevProgress) => {
				if (prevProgress >= 95) {
					clearInterval(interval);
					return prevProgress;
				}
				return prevProgress + 5;
			});
		}, 750);

		return interval;
	};

	const handleDrop = async (acceptedFile: File[]) => {
		try {
			setIsError(false);

			const progressInterval = simulatedProgres();

			await new Promise((resolve) => setTimeout(resolve, 1500));

			const { data, error } = await supabase.storage
				.from("askit")
				.upload(
					`${acceptedFile[0].name.split(".pdf")[0] + new Date().getTime()}.pdf`,
					acceptedFile[0],
					{
						cacheControl: "3600",
						upsert: false,
					}
				);

			clearInterval(progressInterval);
			setProgress(100);

			if (error) {
				setIsError(true);
				setProgress(0);
				return toast.error("6MB 이하의 PDF 파일만 가능합니다.");
			}

			const { data: res } = supabase.storage.from("askit").getPublicUrl(data.path);

			insertFile({ fileName: acceptedFile[0].name, fileKey: data.path, fileUrl: res.publicUrl });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Dropzone multiple={false} onDrop={handleDrop}>
			{({ getRootProps, getInputProps, acceptedFiles }) => (
				<div {...getRootProps()} className="border h-64 m-4 border-dashed rounded-lg">
					<div className="flex items-center justify-center w-full h-full">
						<label
							htmlFor="file-dropzone"
							className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors"
						>
							<div className="flex flex-col items-center justify-center pt-5 pb-4">
								<Upload className="h-7 w-7 text-zinc-500 mb-3" />
								<p className="mb-2 text-sm text-zinc-700">
									<span className="font-semibold">클릭</span> 또는{" "}
									<span className="font-semibold">드래그</span>하여 파일 업로드
								</p>
								<p className="text-xs text-zinc-500"> PDF (최대 6MB)</p>
							</div>

							{acceptedFiles && acceptedFiles[0] ? (
								<div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-neutral-200 divide-x divide-neutral-200">
									<div className="px-3 py-2 h-full grid place-items-center">
										{isError ? (
											<FileWarning className="h-4 w-4 text-red-500" />
										) : (
											<File className="h-4 w-4 text-blue-500" />
										)}
									</div>
									<div className={`px-3 py-2 h-full text-sm truncate ${isError && "text-red-500"}`}>
										{acceptedFiles[0].name}
									</div>
								</div>
							) : (
								<div className="h-9" />
							)}

							{isProcessing ? (
								<div className="w-full mt-4 max-w-xs mx-auto">
									<Progress value={progress} className="h-1 w-full bg-neutral-200" />
								</div>
							) : (
								<div className="mt-4 h-1.5" />
							)}

							<input {...getInputProps()} type="file" id="dropzone-file" className="hidden" />
						</label>
					</div>
				</div>
			)}
		</Dropzone>
	);
};

const UploadButton = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(isOepn) => {
				if (!isOepn) {
					setIsOpen(isOepn);
				}
			}}
		>
			<DialogTrigger onClick={() => setIsOpen(true)} asChild>
				<Button>PDF 파일 업로드하기</Button>
			</DialogTrigger>

			<DialogContent>
				<FileDropzone />
			</DialogContent>
		</Dialog>
	);
};

export default UploadButton;
