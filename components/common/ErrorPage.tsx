import { Center } from "@chakra-ui/react";
import React from "react";

type Props = {
	message?: string;
};

export default function ErrorPage(
	{message}:Props
) {
	return (
		<Center h={"30vh"}>
			{message ? message : "Došlo je do greške."}
		</Center>
	);
}
