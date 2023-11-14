import getCurrentUser from "@/actions/getCurrentUser";
import { QUERY_LIMIT } from "@/constants/config";
import { prisma } from "@/db";
import { pinecone } from "@/lib/pincone";
import { TRPCError } from "@trpc/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc-init";

export const appRouter = router({
	authCallback: publicProcedure.query(async () => {
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}

		return { success: true };
	}),

	getUserFiles: privateProcedure.query(async ({ ctx }) => {
		const { userId } = ctx;

		return await prisma.file.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});
	}),

	getMessages: privateProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional(),
				cursor: z.string().optional(),
				fileId: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { userId } = ctx;
			const { fileId, cursor } = input;
			const limit = input.limit ?? QUERY_LIMIT;

			const fileExists = await prisma.file.count({
				where: {
					id: fileId,
					userId,
				},
			});

			if (!fileExists) {
				throw new TRPCError({ code: "NOT_FOUND", message: "File not found." });
			}

			const messages = await prisma.message.findMany({
				take: limit + 1,
				where: {
					fileId,
				},
				orderBy: {
					createdAt: "desc",
				},
				cursor: cursor ? { id: cursor } : undefined,
				select: {
					id: true,
					isUser: true,
					createdAt: true,
					text: true,
				},
			});

			let nextCursor: string | undefined = undefined;
			if (messages.length > limit) {
				const nextItem = messages.pop();
				nextCursor = nextItem?.id;
			}

			return {
				messages: messages,
				nextCursor: nextCursor,
			};
		}),

	insertFile: privateProcedure
		.input(
			z.object({
				fileUrl: z.string().url(),
				fileName: z.string().min(1),
				fileKey: z.string().min(1),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx;

			const createdFile = await prisma.file.create({
				data: {
					userId,
					status: "PROCESSING",
					url: input.fileUrl,
					name: input.fileName,
					key: input.fileKey,
				},
			});
			try {
				const res = await fetch(input.fileUrl);
				const blob = await res.blob();
				const loader = new PDFLoader(blob);
				const lowLevelDocs = await loader.load();

				const pagesAmt = lowLevelDocs.length;

				if (pagesAmt > 25) {
					return await prisma.file.update({
						data: {
							status: "FAILED",
						},
						where: {
							id: createdFile.id,
						},
					});
				}

				const pineconeIndex = pinecone.Index("askit");

				const embeddings = new OpenAIEmbeddings({
					openAIApiKey: process.env.OPENAI_API_KEY!,
					modelName: "text-embedding-ada-002",
				});

				await PineconeStore.fromDocuments(lowLevelDocs, embeddings, {
					//@ts-ignore
					pineconeIndex,
					namespace: createdFile.id,
				});

				return await prisma.file.update({
					data: {
						status: "SUCCESS",
					},
					where: {
						id: createdFile.id,
					},
				});
			} catch {
				return await prisma.file.update({
					data: {
						status: "FAILED",
					},
					where: {
						id: createdFile.id,
					},
				});
			}
		}),

	deleteFile: privateProcedure
		.input(z.object({ fileId: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx;
			const fileToDelete = await prisma.file.delete({
				where: {
					id: input.fileId,
					userId,
				},
			});

			if (!fileToDelete) {
				throw new TRPCError({ code: "NOT_FOUND" });
			}

			return fileToDelete;
		}),
});

export type AppRouter = typeof appRouter;
