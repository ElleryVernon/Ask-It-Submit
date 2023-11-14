"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../../trpc/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Page = () => {
	const router = useRouter();

	const searchParams = useSearchParams();
	const origin = searchParams.get("origin");

	const { error, isError, isSuccess } = trpc.authCallback.useQuery(undefined);

	useEffect(() => {
		const handleAuthStatus = async () => {
			if (isError) {
				await router.replace("/sign-in");
			}

			if (isSuccess) {
				await router.replace(`/${origin || "dashboard"}`);
			}
		};

		handleAuthStatus();
	}, [error, isError, isSuccess, router]);

	if (!isSuccess) {
		return (
			<div className="w-full mt-24 flex justify-center">
				<div className="flex flex-col items-center gap-2">
					<Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
					<h3 className="font-semibold text-xl mt-3">사용자님의 계정을 확인 중이에요.</h3>
					<p>확인이 완료되면 이동됩니다. 조금만 기다려주세요.</p>
				</div>
			</div>
		);
	}

	return null;
};

export default Page;
