import { prisma } from "@/db";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pincone";
import { MessageValidator } from "@/lib/validators/MessageValidator";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import getCurrentUser from "@/actions/getCurrentUser";

export const maxDuration = 150;

export const POST = async (req: NextRequest) => {
	const body = await req.json();

	const currentUser = await getCurrentUser();

	if (!currentUser?.id) {
		return new Response("Unauthorized", { status: 401 });
	}
	const { id: userId } = currentUser;

	const { fileId, message } = MessageValidator.parse(body);

	const file = await prisma.file.findFirst({
		where: {
			id: fileId,
			userId: userId,
		},
	});

	if (!file) {
		return new Response("Not Found", { status: 404 });
	}

	await prisma.message.create({
		data: {
			text: message,
			isUser: true,
			userId: userId,
			fileId: fileId,
		},
	});

	const embeddings = new OpenAIEmbeddings({
		openAIApiKey: process.env.OPENAI_API_KEY!,
	});

	const pineconeIndex = pinecone.Index("askit");

	const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
		pineconeIndex,
		namespace: file.id,
	});

	const results = await vectorStore.similaritySearch(message, 4);

	const prevMessages = await prisma.message.findMany({
		where: {
			fileId,
		},
		orderBy: {
			createdAt: "asc",
		},
		take: 4,
	});

	const formattedMessages = prevMessages.map((message) => ({
		role: message.isUser ? ("user" as const) : ("assistant" as const),
		content: message.text,
	}));

	const res = await openai.chat.completions.create({
		model: process.env.MODEL!,
		temperature: 0,
		max_tokens: 784,
		stream: true,
		messages: [
			{
				role: "system",
				content: process.env.PROMPT!,
			},
			{
				role: "user",
				content: `다음 문맥(또는 필요한 경우 이전 대화)을 사용하여 엄격한 마크다운 형식으로 사용자의 질문에 답하세요.
답변을 모른다면 답을 지어내려고 하지 말고 모른다고 말하세요.

PREVIOUS CONVERSATION:
${formattedMessages.map((message) => {
	if (message.role === "user") return `User: ${message.content}\n`;
	return `Assistant: ${message.content}\n`;
})}

###

CONTEXT:
${results.map((r) => r.pageContent).join("\n\n")}

USER INPUT: ${message}`,
			},
		],
	});

	const stream = OpenAIStream(res, {
		async onCompletion(completion) {
			const result =
				completion.startsWith("```markdown") && completion.endsWith("```")
					? completion.slice(12, -3)
					: completion.startsWith("```") && completion.endsWith("```")
					? completion.slice(4, -3)
					: completion;

			await prisma.message.create({
				data: {
					text: result,
					isUser: false,
					fileId: fileId,
					userId: userId,
				},
			});
		},
	});

	return new StreamingTextResponse(stream);
};
