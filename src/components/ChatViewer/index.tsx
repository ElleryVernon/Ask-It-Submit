import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Messages from "./Messages";
import UserInput from "./UserInput";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { ChatProvider } from "@/context/Chat";

interface ChatViewerProps {
	fileId: string;
	status: "SUCCESS" | "PROCESSING" | "FAILED";
}

const ChatViewer = ({ fileId, status }: ChatViewerProps) => {
	if (status === "PROCESSING")
		return (
			<div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
				<div className="flex-1 flex justify-center items-center flex-col my-20 sm:mb-28">
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="h-8 w-8 text-zinc-900 animate-spin" />
						<h3 className="font-semibold text-xl">불러오고 있어요...</h3>
						<p className="text-zinc-500 text-sm">회원님의 대화 기록을 준비중이에요.</p>
					</div>
				</div>

				<UserInput isDisabled={status === "PROCESSING"} />
			</div>
		);

	if (status === "FAILED") {
		return (
			<div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
				<div className="flex-1 flex justify-center items-center flex-col my-20 sm:mb-28">
					<div className="flex flex-col items-center gap-2">
						<XCircle className="h-8 w-8 text-red-500" />
						<h3 className="font-semibold text-xl">PDF에 페이지가 너무 많아요...</h3>
						<p className="text-zinc-500 text-sm">
							회원님의 요금제에서는 최대 25장 이하의 PDF 파일만 사용가능해요.
						</p>
						<Link
							href="/dashboard"
							className={buttonVariants({
								variant: "secondary",
								className: "mt-4 border-[1px] border-zinc-200",
								size: "sm",
							})}
						>
							<ChevronLeft className="h-3 w-3 mr-1.5" />
							대시보드로 돌아가기
						</Link>
					</div>
				</div>

				<UserInput isDisabled={status === "FAILED"} />
			</div>
		);
	}

	return (
		<ChatProvider fileId={fileId}>
			<div className="relative min-h-full bg-zinc-50 flex flex-col divide-y divide-zinc-200 justify-between gap-2 ">
				<div className="flex-1 justify-between flex flex-col mb-2">
					<Messages fileId={fileId} />
				</div>
				<UserInput />
			</div>
		</ChatProvider>
	);
};

export default ChatViewer;
