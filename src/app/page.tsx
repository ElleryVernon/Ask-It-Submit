import Link from "next/link";
import MainContainer from "../components/MainContainer";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function Home() {
	const currentUser = await getCurrentUser();

	if (currentUser) {
		redirect("/dashboard");
	}

	return (
		<>
			<MainContainer
				className={`
        mb-12
        mt-28
        sm:mt-40
        flex
        flex-col
        items-center
        justify-center
        text-center
      `}
			>
				<div
					className="
          mx-auto
          mb-4
          flex
          max-w-fit
          items-center
          justify-center
          space-x-2
          overflow-hidden
          rounded-full
          border
          border-gray-200
          bg-white
          px-7
          py-2
          shadow-md
          backdrop-blur
          transition-all
          hover:border-gray-300
          hover:bg-white/50
        "
				>
					<p className="text-sm font-semibold text-gray-700">AskIt 준비완료!</p>
				</div>
				<h1
					className="
        text-[#18181B]
          max-w-4xl
          text-[40px]
          font-bold
          md:text-[48px]
          lg:text-[60px]
        "
				>
					빠르게 <span className="text-purple-600">PDF에서 영감</span>을 얻어보세요.
				</h1>
				<p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
					AskIt를 사용하면 어떤 PDF 문서에서도 빠르게 정보를 얻을 수 있습니다. <br />
					파일을 업로드하고 바로 질문을 시작하세요.
				</p>

				<Link
					className={
						buttonVariants({
							size: "lg",
							class: "mt-5",
						}) + "cursor-pointer"
					}
					href="/dashboard"
					target="_blank"
				>
					시작하기 <ArrowRight className="ml-2 h-5 w-5" />
				</Link>
			</MainContainer>

			{/** 가치 전달 세션 */}
			<div>
				<div className="relative isolate">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-0 top-0 -z-20 transform-gpu overflow-hidden blur-3xl"
					>
						<div
							style={{
								clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
							}}
							className="relative left-1/2 aspect-[1155/480] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-[#6ee7b7] via-[#3b82f6] to-[#9333ea] opacity-20 sm:w-[120rem]"
						/>
					</div>
					<div>
						<div className="mx-auto max-w-6xl px-6 lg:px-8">
							<div className="mt-16 flow-root sm:mt-24">
								<div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
									<Image
										src="/dashboard-preview3.png"
										alt="product preview"
										width={1364}
										height={866}
										quality={100}
										className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
				<div className="mb-12 px-6 lg:px-8">
					<div className="mx-auto max-w-2xl sm:text-center">
						<h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
							간단하고 빠르게 시작할 수 있어요
						</h2>
						<p className="mt-4 text-lg text-gray-600">
							AskIt을 사용하면 PDF 파일에서 정보를 얻기가 어느 때보다 쉬워집니다.
						</p>
					</div>
				</div>

				<ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
					<li className="md:flex-1">
						<div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-3 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
							<span className="text-sm font-medium text-purple-600">단계 1</span>
							<span className="text-xl font-semibold">계정 만들기</span>
							<span className="mt-2 text-zinc-700">
								무료 플랜으로 시작하거나{" "}
								<Link href="/pricing" className="text-blue-700 underline underline-offset-2">
									프로 플랜
								</Link>
								을 선택하세요.
							</span>
						</div>
					</li>
					<li className="md:flex-1">
						<div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-3 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
							<span className="text-sm font-medium text-purple-600">단계 2</span>
							<span className="text-xl font-semibold">PDF 파일 업로드하기</span>
							<span className="mt-2 text-zinc-700">파일을 처리하여 대화할 준비를 해드립니다.</span>
						</div>
					</li>
					<li className="md:flex-1">
						<div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-3 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
							<span className="text-sm font-medium text-purple-600">단계 3</span>
							<span className="text-xl font-semibold">질문 시작하기</span>
							<span className="mt-2 text-zinc-700">
								정말 간단합니다. 오늘 바로 AskIt을 사용해보세요 - 정말 몇 분이면 충분합니다.
							</span>
						</div>
					</li>
				</ol>

				<div className="mx-auto max-w-6xl px-6 lg:px-8">
					<div className="mt-16 flow-root sm:mt-24">
						<div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
							<Image
								src="/file-upload-preview2.png"
								alt="product preview"
								width={1419}
								height={732}
								quality={100}
								className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
