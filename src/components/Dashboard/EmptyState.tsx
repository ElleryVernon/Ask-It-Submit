import { CircleDashed } from "lucide-react";

export const EmptyState = () => (
	<div className="mt-24 flex flex-col items-center gap-2">
		<CircleDashed className="h-8 w-8 text-zinc-800" />
		<h3 className="font-semibold text-xl mt-3">여긴 아직 텅 비어있어요</h3>
		<p>첫 PDF 문서로 이 공간을 채워주세요</p>
	</div>
);
