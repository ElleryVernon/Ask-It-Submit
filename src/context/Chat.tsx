"use client";

import { QUERY_LIMIT } from "@/constants/config";
import { trpc } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, createContext, useRef, useState } from "react";
import { toast } from "sonner";

type StreamResponse = {
	insertMessage: () => void;
	message: string;
	handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
	insertMessage: () => {},
	message: "",
	handleInputChange: () => {},
	isLoading: false,
});

interface ContextProps {
	fileId: string;
	children: ReactNode;
}

export const ChatProvider = ({ fileId, children }: ContextProps) => {
	const [message, setMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const utils = trpc.useUtils();

	const backupMessage = useRef("");

	const { mutate: sendMessage } = useMutation({
		mutationFn: async ({ message }: { message: string }) => {
			const res = await fetch("/api/message", {
				method: "POST",
				body: JSON.stringify({
					fileId,
					message,
				}),
			});

			if (!res.ok) {
				throw new Error("메세지 전송에 실패했습니다");
			}

			return res.body;
		},
		onMutate: async ({ message }) => {
			backupMessage.current = message;
			setMessage("");

			await utils.getMessages.cancel();

			const previousMessages = utils.getMessages.getInfiniteData();

			utils.getMessages.setInfiniteData({ fileId, limit: QUERY_LIMIT }, (old) => {
				if (!old) {
					return {
						pages: [],
						pageParams: [],
					};
				}

				let newPages = [...old.pages];
				let latestPage = newPages[0]!;

				latestPage.messages = [
					{
						createdAt: new Date().toISOString(),
						id: crypto.randomUUID(),
						text: message,
						isUser: true,
					},
					...latestPage.messages,
				];
				newPages[0] = latestPage;

				return {
					...old,
					pages: newPages,
				};
			});
			setIsLoading(true);

			return {
				previousMessages: previousMessages?.pages.flatMap((page) => page.messages) ?? [],
			};
		},
		onSuccess: async (stream) => {
			setIsLoading(false);

			if (!stream) {
				return toast.error("메세지 전송에 실패했습니다. 다시 시도해주세요.");
			}

			const reader = stream.getReader();
			const decoder = new TextDecoder();
			let done = false;

			let accResponse = "";

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunkValue = decoder.decode(value);

				accResponse += chunkValue;

				utils.getMessages.setInfiniteData({ fileId, limit: QUERY_LIMIT }, (old) => {
					if (!old) return { pages: [], pageParams: [] };
					let isAiResponseCreated = old.pages.some((page) =>
						page.messages.some((message) => message.id === "ai-response")
					);

					let updatedPages = old.pages.map((page) => {
						if (page === old.pages[0]) {
							let updatedMessages;

							if (!isAiResponseCreated) {
								updatedMessages = [
									{
										createdAt: new Date().toISOString(),
										id: "ai-response",
										text: accResponse,
										isUser: false,
									},
									...page.messages,
								];
							} else {
								updatedMessages = page.messages.map((message) => {
									if (message.id === "ai-response") {
										return {
											...message,
											text: accResponse,
										};
									}
									return message;
								});
							}

							return {
								...page,
								messages: updatedMessages,
							};
						}

						return page;
					});

					return { ...old, pages: updatedPages };
				});
			}
		},
		onError: (_, __, context) => {
			setMessage(backupMessage.current);
			utils.getMessages.setData({ fileId }, { messages: context?.previousMessages ?? [] });
		},
		onSettled: async () => {
			setIsLoading(false);
			await utils.getMessages.invalidate({ fileId });
		},
	});

	const insertMessage = () => sendMessage({ message });

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage((_) => e.target.value);
	};

	return (
		<ChatContext.Provider
			value={{
				insertMessage,
				message,
				handleInputChange,
				isLoading,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};
