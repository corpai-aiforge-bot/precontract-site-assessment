// frontend/pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import "@/styles/globals.css";
import Layout from '../components/Layout';




export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
