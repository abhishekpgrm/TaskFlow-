import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-4 text-4xl font-bold text-primary">404</h2>
      <p className="mb-8 text-lg text-secondary">
        Oops! The page you are looking for could not be found.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        Return Home
      </Link>
    </div>
  );
}
