import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

export type File = {
	url: string;
	name: string;
	id: string;
	key: string;
	userId: string | null;
	createdAt: string;
	updatedAt: string;
};

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput["getMessages"]["messages"];

type OmitText = Omit<Messages[number], "text">;

type ExtendedText = {
	text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ExtendedText;

export const PLANS = [
	{
		name: "Free",
		slug: "free",
		quota: 10,
		pagesPerPdf: 5,
		price: {
			amount: 0,
			priceIds: {
				test: "",
				production: "",
			},
		},
	},
	{
		name: "Pro",
		slug: "pro",
		quota: 50,
		pagesPerPdf: 25,
		price: {
			amount: 14,
			priceIds: {
				test: "price_1NuEwTA19umTXGu8MeS3hN8L",
				production: "",
			},
		},
	},
];
