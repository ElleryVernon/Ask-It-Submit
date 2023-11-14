import { File } from "@/constants/type";
import { format } from "date-fns";
import { MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { RiOpenaiFill } from "react-icons/ri";
import DeleteButton from "./DeleteButton";

interface FileItemProps {
	file: File;
}

const FileItem = ({ file }: FileItemProps) => {
	return (
		<li
			className="
            col-span-1
            divide-y
            divide-gray-200
            rounded-[18px]
            bg-white
            border
            transition
            hover:shadow
        "
		>
			<Link
				href={`/dashboard/${file.id}`}
				className="
                flex 
                flex-col 
                gap-2
				cursor-pointer
            "
			>
				<div className="pt-5 pb-1 px-6 flex w-full items-center justify-between space-x-4">
					<div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-r bg-neutral-50 border-[1px] border-neutral-300 flex items-center justify-center">
						<RiOpenaiFill size={18} />
					</div>
					<div className="flex-1 truncate">
						<div className="flex items-center space-x-3">
							<h3 className="truncate text-lg font-medium text-zinc-900 text-[15px]">
								{file.name}
							</h3>
						</div>
					</div>
				</div>
			</Link>

			<div className="px-0 sm:px-2 md:px-3.5 mt-4 grid grid-cols-3 place-items-center pt-3 pb-3.5 gap-6 text-[11px] text-zinc-500">
				<div className="flex items-center gap-2">
					<Plus className="h-4 w-4" /> {format(new Date(file.createdAt), "MMM yyyy")}
				</div>

				<div className="flex items-center gap-2">
					<MessageSquare className="h-4 w-4" />
					Demo
				</div>

				<DeleteButton fileId={file.id} />
			</div>
		</li>
	);
};

export default FileItem;
