"use client";

import Link from "next/link";
import MainContainer from "./MainContainer";
import { Button, buttonVariants } from "./ui/button";
import { signIn, signOut } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
	currentUser: {
		createdAt: string;
		updatedAt: string;
		emailVerified: string | null;
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	} | null;
}

const Navbar = ({ currentUser }: NavbarProps) => {
	return (
		<nav className="fixed h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/60 backdrop-blur-lg transition-all">
			<MainContainer>
				<div className="flex h-14 items-center justify-between border-b border-zinc-200">
					<Link href="/" className="text-xl text-zinc-700 flex z-40 font-bold cursor-pointer">
						<span>AskIt</span>
					</Link>

					<div className="items-center space-x-0 sm:space-x-4 flex">
						<>
							<Link
								href="/pricing"
								className={buttonVariants({
									variant: "ghost",
									size: "default",
								})}
							>
								요금
							</Link>
							{!currentUser ? (
								<>
									<Button
										className="hidden sm:flex"
										variant="ghost"
										size="default"
										onClick={() => signIn("kakao")}
									>
										로그인
									</Button>
									<Button size="sm" onClick={() => signIn("kakao")} className="cursor-pointer">
										시작하기 <ArrowRight className="ml-1.5 h-3 w-3" />
									</Button>
								</>
							) : (
								<Button variant="ghost" size="sm" onClick={() => signOut()} className="">
									<Image
										src={`https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${currentUser.name}`}
										width={100}
										height={100}
										className="h-7 w-7 border rounded-full mr-2"
										alt="user profile"
									/>
									<div className="flex flex-col items-start justify-center mt-1">
										<p className="text-[13px] leading-3">{currentUser.name}</p>
										<p className="text-[11px] text-zinc-500">로그아웃</p>
									</div>
								</Button>
							)}
						</>
					</div>
				</div>
			</MainContainer>
		</nav>
	);
};

export default Navbar;
