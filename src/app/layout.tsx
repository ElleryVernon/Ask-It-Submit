import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/trpc/Providers";
import { Toaster } from "sonner";

import "simplebar-react/dist/simplebar.min.css";
import getCurrentUser from "@/actions/getCurrentUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Ask It",
	description: "Ask It",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const currentUser = await getCurrentUser();
	return (
		<html lang="en">
			<body className={cn("min-h-screen font-sans antialiased grainy")}>
				<Providers>
					<Toaster position="top-center" />
					<Navbar currentUser={currentUser} />
					<main className="pt-14">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
