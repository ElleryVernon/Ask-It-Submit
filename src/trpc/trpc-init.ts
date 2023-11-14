import getCurrentUser from "@/actions/getCurrentUser";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (options) => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return options.next({
		ctx: {
			userId: currentUser.id,
			currentUser,
		},
	});
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
