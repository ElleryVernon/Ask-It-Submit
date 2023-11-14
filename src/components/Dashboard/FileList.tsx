import { File } from "@/constants/type";
import FileItem from "./FileItem";

interface FileListProps {
	files: File[];
}

const FileList = ({ files }: FileListProps) => {
	return (
		<ul
			className="
                mt-8
                grid
                grid-cols-1
                gap-6
                divide-y
                divide-zinc-200
                md:grid-cols-2
                lg:grid-cols-3
            "
		>
			{files.map((file, idx) => (
				<FileItem file={file} key={idx} />
			))}
		</ul>
	);
};

export default FileList;
