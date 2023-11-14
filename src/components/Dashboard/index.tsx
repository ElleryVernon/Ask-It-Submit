"use client";

import { trpc } from "@/trpc/client";
import FileLoader from "./FileLoader";

import Container from "./Container";
import { EmptyState } from "./EmptyState";
import { ErrorMessage } from "./ErrorMessage";
import FileList from "./FileList";
import Header from "./Header";

const Dashboard = () => {
	const { data: files, isLoading, isError } = trpc.getUserFiles.useQuery();

	return (
		<Container>
			<Header />
			{isError && <ErrorMessage />}
			{isLoading && <FileLoader />}
			{!isLoading && !files?.length ? <EmptyState /> : <FileList files={files || []} />}
		</Container>
	);
};

export default Dashboard;
