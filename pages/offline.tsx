import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Offline() {
  return (
    <>
      <Head>
        <title>Offline - Sp1sh</title>
        <meta name="description" content="You are currently offline" />
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            You're Offline
          </h1>
          <div className="text-6xl mb-4">🔌</div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            It looks like you're currently offline. Some features of Sp1sh require an internet connection.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Don't worry, most scripts and frequently visited pages are available offline.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
            Try again
          </Link>
        </div>
      </div>
    </>
  );
}
