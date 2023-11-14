import Link from "next/link";
import MainContainer from "@/components/MainContainer";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, Ghost } from "lucide-react";

export default function Home() {
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
				<Ghost size={56} />
				<h3 className="font-semibold text-3xl mt-5 mb-2">404</h3>
				<h3 className="font-medium text-2xl mb-6 text-zinc-600">
					저런... 찾을 수 없는 페이지에요!
				</h3>
				<Link href="/" className={buttonVariants()}>
					<ChevronLeft size={16} className="mr-1" />
					메인으로 돌아가기
				</Link>
			</MainContainer>
		</>
	);
}
