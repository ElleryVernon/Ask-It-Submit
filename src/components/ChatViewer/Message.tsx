import { ExtendedMessage } from "@/constants/type";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import { RiOpenaiFill } from "react-icons/ri";
import MarkdownFormatter from "../MarkdownFormatter";
import { forwardRef } from "react";

interface MessageProps {
	message: ExtendedMessage;
	isSameSender: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(({ message, isSameSender }, ref) => {
	return (
		<div ref={ref}>
			{!isSameSender &&
				(message.isUser ? (
					<div className={cn("flex flex-col items-end py-5  px-5 border-y")}>
						<div className="flex items-center gap-1">
							<div
								className={cn(
									"relative flex h-6 w-6 aspect-square items-center justify-center order-1 bg-white border rounded-full"
								)}
							>
								<User2 className="h-3/4 w-3/4" />
							</div>

							<span className={cn("text-[15px] text-zinc-900 font-semibold")}>나</span>
						</div>
						{typeof message.text === "string" ? (
							<div className="pr-6">
								<MarkdownFormatter>{message.text}</MarkdownFormatter>
							</div>
						) : (
							<p className="pt-1 text-zinc-700 pr-6">{message.text}</p>
						)}
					</div>
				) : (
					<div className={cn("flex flex-col items-start py-5 bg-[#F3F4F6] border-y px-5")}>
						<div className="flex items-center gap-1">
							<div
								className={cn(
									"relative flex h-6 w-6 aspect-square items-center justify-center order-1 bg-[#AB68FF] rounded-full border border-gray"
								)}
							>
								<RiOpenaiFill className="h-3/4 w-3/4 text-white" />
							</div>

							<span className={cn("text-[15px] text-zinc-900 font-semibold order-2")}>ChatGPT</span>
						</div>
						{typeof message.text === "string" ? (
							<div className="pl-6">
								<MarkdownFormatter>{message.text}</MarkdownFormatter>
							</div>
						) : (
							<p className="pt-1 text-zinc-700 pl-6">{message.text}</p>
						)}
					</div>
				))}
		</div>
	);
});

Message.displayName = "Message";

export default Message;
