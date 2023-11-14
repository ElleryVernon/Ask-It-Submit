import getCurrentUser from "@/actions/getCurrentUser";
import ChatViewer from "@/components/ChatViewer";
import PDFViewer from "@/components/PDFViewer";
import { prisma } from "@/db";
import { notFound, redirect } from "next/navigation";

interface PageProps {
	params: {
		detailId: string;
	};
}

const Page = async ({ params: { detailId } }: PageProps) => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return redirect("/");
	}
	const file = await prisma.file.findFirst({
		where: {
			id: detailId,
			userId: currentUser.id,
		},
	});

	if (!file) return notFound();

	return (
		<div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
			<div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
				<div className="flex-1 xl:flex">
					<div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
						<PDFViewer url={file.url} />
					</div>
				</div>

				<div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
					<ChatViewer fileId={file.id} status={file.status} />
				</div>
			</div>
		</div>
	);
};

export default Page;
