"use client";

import { QUERY_LIMIT } from "@/constants/config";
import { trpc } from "@/trpc/client";
import { Loader2, MessageSquare } from "lucide-react";
import Message from "./Message";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/context/Chat";
import { useIntersection } from "@mantine/hooks";

interface MessagesProps {
	fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
	const { isLoading: isStreaming } = useContext(ChatContext);
	const { data, isLoading, fetchNextPage } = trpc.getMessages.useInfiniteQuery(
		{
			fileId,
			limit: QUERY_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			keepPreviousData: true,
		}
	);

	const loadingMessage = {
		createdAt: new Date().toISOString(),
		id: "loading-message",
		isUser: false,
		text: (
			<span className="flex h-full items-center justify-center">
				<span className="relative flex h-4 w-4">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full  bg-neutral-400 opacity-75"></span>
					<span className="relative inline-flex rounded-full h-4 w-4  bg-neutral-400 "></span>
				</span>
			</span>
		),
	};

	const messages = data?.pages.flatMap((page) => page.messages);

	const combinedMessages = [...(isStreaming ? [loadingMessage] : []), ...(messages ?? [])];

	const lastMessageRef = useRef<HTMLDivElement>(null);

	const { ref, entry } = useIntersection({
		root: lastMessageRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage();
		}
	}, [entry, fetchNextPage]);

	return (
		<div className="flex max-h-[85vh] border-zinc-200 flex-1 flex-col-reverse overflow-y-auto">
			{combinedMessages && combinedMessages.length > 0 ? (
				<>
					{combinedMessages.map((message, idx) => {
						const isSameSender =
							combinedMessages[idx - 1]?.isUser === combinedMessages[idx]?.isUser;

						if (idx === combinedMessages.length - 1) {
							return <Message ref={ref} message={message} isSameSender={isSameSender} key={idx} />;
						}
						return <Message message={message} isSameSender={isSameSender} key={idx} />;
					})}
				</>
			) : isLoading ? (
				<div className="w-full flex flex-col gap-2"></div>
			) : (
				<div className="flex-1 flex flex-col items-center justify-center gap-2">
					<MessageSquare className="h-8 w-8 text-zinc-900" />
					<h3 className="font-semibold text-xl">You&apos;re all set!</h3>
					<p className="text-zinc-500 text-sm">Ask your first question to get started.</p>
				</div>
			)}
		</div>
	);
};

export default Messages;
