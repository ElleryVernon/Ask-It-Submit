"use state";

import { AlertCircle, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDeleteFile } from "./hooks/useDeleteFile";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "../ui/dialog";

interface DeleteButtonProps {
	fileId: string;
}

const DeleteButton = ({ fileId }: DeleteButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const deleteFile = useDeleteFile();
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
				<Button
					className="w-full text-[13px] font-semibold bg-red-50 mr-5 rounded-[14px] gap-1.5 text-rose-500 border border-rose-500 hover:bg-red-100 transition-color"
					variant="destructive"
				>
					<Trash className="h-4 w-4" color="red" />
					삭제
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<div className="px-1 mb-2">
						<DialogTitle>문서 삭제</DialogTitle>
						<p className="text-[15px] text-zinc-700 mt-2">
							문서의 모든 내용 및 대화 기록이 삭제됩니다.
						</p>
					</div>
					<div className="text-[13px] sm:text-[13px] bg-red-50 border border-red-500 text-red-500 rounded-md px-3 py-2">
						<p>
							<span className="font-bold">경고:</span> 이 작업은 실행 후 되돌릴 수 없습니다.
						</p>
					</div>
				</DialogHeader>

				<div className="flex justify-between">
					<Button
						variant="ghost"
						className="border border-zinc-300"
						onClick={() => setIsOpen(false)}
					>
						취소
					</Button>
					<Button
						onClick={() => {
							deleteFile({ fileId });
							setIsOpen(false);
						}}
					>
						계속
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteButton;
