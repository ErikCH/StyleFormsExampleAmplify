import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import awsExports from "@/aws-exports";
import "@aws-amplify/ui-react/styles.css";
import '@fontsource/inter/variable.css';
import "@/styles/globals.css";
import React from "react";
import Layout from "@/components/Layout";
Amplify.configure(awsExports);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
