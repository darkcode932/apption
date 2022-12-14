import React from 'react'
import Link from 'next/link'

export default function PageNotFound() {
  return (
    <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8 flex justify-center h-screen">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-bold tracking-tight text-green-400 sm:text-5xl">404</p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                <p className="mt-1 text-base text-gray-500">Please check the URL in the address bar and try again.</p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  href="/home"
                  className="inline-flex items-center rounded-md border border-transparent bg-green-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
                >
                  Go back home
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-green-400 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}
