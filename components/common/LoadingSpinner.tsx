import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

export default function LoadingSpinner() {
	return (
		<Center h={"30vh"}>
			<Spinner />
		</Center>
	);
}
