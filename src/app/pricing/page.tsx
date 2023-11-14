import getCurrentUser from "@/actions/getCurrentUser";
import MainContainer from "@/components/MainContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PLANS } from "@/constants/type";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import Link from "next/link";

const Page = async () => {
	const currentUser = await getCurrentUser();

	const pricingItems = [
		{
			plan: "취미용",
			tagline: "작은 PDF 파일에 적합합니다.",
			quota: 10,
			price: 0,
			features: [
				{
					text: "PDF 파일 당 25장 까지",
					footnote: "PDF파일 1개 당 최대 업로드 허용 페이지 수",
					negative: false,
				},
				{
					text: "6MB 파일 크기 제한",
					footnote: "PDF파일 1개 당 최대 업로드 허용 사이즈",
					negative: false,
				},
				{
					text: "모바일 친화적인 인터페이스",
					negative: false,
				},
				{
					text: "더 높은 품질과 응답 속도",
					footnote: "향상된 콘텐츠 품질을 위한 더 나은 알고리즘",
					negative: true,
				},
				{
					text: "우선 지원",
					negative: true,
				},
			],
		},
		{
			plan: "전문가용",
			tagline: "더 큰 PDF 파일에 적합합니다.",
			quota: PLANS.find((p) => p.slug === "pro")!.quota,
			price: 15,
			features: [
				{
					text: "PDF 당 50장 까지",
					footnote: "PDF파일 1개 당 최대 업로드 허용 페이지 수",
					negative: false,
				},
				{
					text: "16MB 파일 크기 제한",
					footnote: "PDF파일 1개 당 최대 업로드 허용 사이즈",
					negative: false,
				},
				{
					text: "모바일 친화적인 인터페이스",
					negative: false,
				},
				{
					text: "더 높은 품질과 응답 속도",
					footnote: "향상된 콘텐츠 품질을 위한 더 나은 알고리즘",
					negative: false,
				},
				{
					text: "우선 지원",
					negative: false,
				},
			],
		},
	];

	return (
		<>
			<MainContainer className="mb-8 mt-24 text-center max-w-5xl">
				<div className="mx-auto mb-10 sm:max-w-lg">
					<h1 className="text-4xl font-bold sm:text-5xl flex flex-col gap-2">
						<div>무료로 시작하고</div> <div>필요한 만큼 구독하세요</div>
					</h1>
					<p className="mt-5 text-gray-600 sm:text-lg">
						<div>예측 가능한 요금으로 필요한만큼 리소스를 구독하세요.</div>
						<div>월간 정기결제로 자동으로 결제됩니다.</div>
					</p>
				</div>

				<div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
					<TooltipProvider>
						{pricingItems.map(({ plan, tagline, quota, features, price }) => {
							return (
								<div
									key={plan}
									className={cn("relative rounded-lg bg-white shadow-lg", {
										"border-2 border-blue-600 shadow-blue-200": plan === "전문가용",
										"border border-gray-200": plan !== "전문가용",
									})}
								>
									{plan === "전문가용" && (
										<div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm  text-white font-semibold">
											준비중
										</div>
									)}

									<div className="p-5">
										<h3 className="my-3 text-center font-display text-3xl font-bold">{plan}</h3>
										<p className="text-gray-500">{tagline}</p>
										<p className="my-5 font-display text-6xl font-semibold">${price}</p>
										<p className="text-gray-500">월간 결제 기준</p>
									</div>

									<div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
										<div className="flex items-center space-x-1">
											<p>{quota.toLocaleString()} PDFs/월간 업로드 기준</p>

											<Tooltip delayDuration={300}>
												<TooltipTrigger className="cursor-default ml-1.5">
													<HelpCircle className="h-4 w-4 text-zinc-500" />
												</TooltipTrigger>
												<TooltipContent className="w-80 p-2">
													월간 업로드 가능 PDF 파일
												</TooltipContent>
											</Tooltip>
										</div>
									</div>

									<ul className="my-10 space-y-5 px-8">
										{features.map(({ text, footnote, negative }) => (
											<li key={text} className="flex space-x-5">
												<div className="flex-shrink-0">
													{negative ? (
														<Minus className="h-6 w-6 text-gray-300" />
													) : (
														<Check className="h-6 w-6 text-blue-500" />
													)}
												</div>
												{footnote ? (
													<div className="flex items-center space-x-1">
														<p
															className={cn("text-gray-600", {
																"text-gray-400": negative,
															})}
														>
															{text}
														</p>
														<Tooltip delayDuration={300}>
															<TooltipTrigger className="cursor-default ml-1.5">
																<HelpCircle className="h-4 w-4 text-zinc-500" />
															</TooltipTrigger>
															<TooltipContent className="w-80 p-2">{footnote}</TooltipContent>
														</Tooltip>
													</div>
												) : (
													<p
														className={cn("text-gray-600", {
															"text-gray-400": negative,
														})}
													>
														{text}
													</p>
												)}
											</li>
										))}
									</ul>
									<div className="border-t border-gray-200" />
									<div className="p-5">
										{plan === "취미용" ? (
											<Link
												href={currentUser ? "/dashboard" : "/sign-in"}
												className={buttonVariants({
													className: "w-full",
													variant: "secondary",
												})}
											>
												체험하기
												<ArrowRight className="h-5 w-5 ml-1.5" />
											</Link>
										) : currentUser ? (
											<Button disabled={true} className="w-full">
												준비중
											</Button>
										) : (
											<Link
												href="/sign-in"
												className={buttonVariants({
													className: "w-full",
												})}
											>
												{currentUser ? "업그레이드" : "시작하기"}
												<ArrowRight className="h-5 w-5 ml-1.5" />
											</Link>
										)}
									</div>
								</div>
							);
						})}
					</TooltipProvider>
					``
				</div>
			</MainContainer>
		</>
	);
};

export default Page;
