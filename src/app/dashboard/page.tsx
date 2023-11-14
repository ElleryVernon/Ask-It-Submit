import getCurrentUser from "@/actions/getCurrentUser";
import Dashboard from "@/components/Dashboard";
import { redirect } from "next/navigation";

const Page = async () => {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return redirect("/");
	}

	return <Dashboard />;
};

export default Page;
