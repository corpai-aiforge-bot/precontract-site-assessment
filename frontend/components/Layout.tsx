import Head from 'next/head';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'PreContract Site Assessment' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="bg-blue-900 text-white py-4 shadow">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-semibold">🏗️ PreContract Site Assessment</h1>
        </div>
      </header>

      <main className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>

      <footer className="bg-white border-t mt-12 py-4 text-sm text-center text-gray-500">
        <div className="max-w-4xl mx-auto">
          &copy; {new Date().getFullYear()} Corporate AI Solutions — All rights reserved.
        </div>
      </footer>
    </>
  );
}
