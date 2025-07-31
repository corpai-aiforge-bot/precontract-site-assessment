import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title></title>
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">👷‍♂️ Welcome to PreContract Site Assessment</h1>
          <p className="text-lg text-gray-600 mb-6">
            Start your assessment by selecting a service from the menu or navigating to the form.
          </p>

          <Link href="/ui1">
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
              Begin Site Assessment
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
