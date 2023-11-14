import UploadButton from "./UploadButton";

const Header = () => {
	return (
		<header
			className="
                mt-8
                flex
                flex-col
                gap-4
                border-b
                border-gray-200
                pb-5
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
		>
			<h1
				className="
            text-2xl
            sm:text-3xl
            font-bold
            text-neutral-900
        "
			>
				내 파일들
			</h1>
			<UploadButton />
		</header>
	);
};

export default Header;
