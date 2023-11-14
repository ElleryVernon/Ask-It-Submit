import { ReactNode } from "react";

interface ContainerProps {
	children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
	return <main className="mx-auto max-w-7xl px-4 md:p-10">{children}</main>;
};

export default Container;
