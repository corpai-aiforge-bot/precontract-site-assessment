// frontend/pages/index.tsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome | PreContract Site Assessment</title>
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">👷‍♂️ Welcome to PreContract Site Assessment</h1>
          <p className="text-lg text-gray-600">
            Start your assessment by selecting a service from the menu or navigating to the form.
          </p>
        </div>
      </main>
    </>
  );
}

