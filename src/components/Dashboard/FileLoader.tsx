import { Loader2 } from "lucide-react";

const FileLoader = () => {
	return (
		<div className="w-full mt-24 flex justify-center">
			<div className="flex flex-col items-center gap-2">
				<Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
				<h3 className="font-semibold text-xl mt-3">사용자님의 파일을 확인 중이에요...</h3>
				<p>조금만 기다려주세요.</p>
			</div>
		</div>
	);
};

export default FileLoader;
