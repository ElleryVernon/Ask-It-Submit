"use client";

import { File } from "@/constants/type";
import { supabase } from "@/supabase";
import { trpc } from "@/trpc/client";

export const useDeleteFile = () => {
	const utils = trpc.useUtils();

	const { mutate: deleteFile } = trpc.deleteFile.useMutation({
		onSuccess: async (file: File) => {
			await supabase.storage.from("askit").remove([file.key]);
			utils.getUserFiles.invalidate();
		},
		retry: true,
		retryDelay: 400,
	});

	return deleteFile;
};
