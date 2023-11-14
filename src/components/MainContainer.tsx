import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MainContainer {
	className?: string;
	children: ReactNode;
}

const MainContainer: React.FC<MainContainer> = ({ className, children }) => {
	return (
		<div className={cn("mx-auto w-full max-w-screen-xl px-4 md:px-10", className)}>{children}</div>
	);
};

export default MainContainer;
