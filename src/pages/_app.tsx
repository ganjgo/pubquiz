import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../../layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Enterwell Quiz</title>
      </Head>
      <SessionProvider session={pageProps.session}>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </ChakraProvider>
      </SessionProvider>
    </>
  );
}
