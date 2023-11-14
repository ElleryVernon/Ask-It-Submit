"use client";

import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChatContext } from "@/context/Chat";
import { useContext, useRef } from "react";

interface UserInput {
	isDisabled?: boolean;
}

const UserInput = ({ isDisabled }: UserInput) => {
	const { insertMessage, handleInputChange, isLoading, message } = useContext(ChatContext);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent) => {
		e.preventDefault();
		insertMessage();
		textareaRef.current?.focus();
	};

	return (
		<div className="abolute bottom-0 left-0 w-full">
			<form
				action=""
				className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl xl:max-w-4xl"
			>
				<div className="relative flex h-full flex-1 items-stretch md:flex-col">
					<div className="relative flex flex-col w-full flex-grow p-4">
						<div className="relative flex items-center">
							<Textarea
								ref={textareaRef}
								onChange={handleInputChange}
								value={message}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										handleSubmit(e);
									}
								}}
								rows={1}
								maxRows={5}
								placeholder="질문을 입력해주세요..."
								className="pr-12 text-base py-3 rounded-xl px-5 text-[15px]"
							/>
							<Button
								className="absolute bottom-[6p5] right-[8px] w-9 p-1 rounded-lg"
								type="submit"
								onClick={handleSubmit}
								disabled={isLoading || isDisabled}
							>
								<Send className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default UserInput;
