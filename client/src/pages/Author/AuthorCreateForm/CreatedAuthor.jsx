import { Link, useParams } from "react-router-dom";

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 sm:h-20 sm:w-20 text-green-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function CreatedAuthor() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 px-4 py-12 sm:px-6 lg:px-8 antialiased">
      <div className="w-full max-w-md bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl p-8 sm:p-10 md:p-12 text-center">
        <div className="flex justify-center mb-6 sm:mb-8">
          <CheckCircleIcon />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 mb-3 sm:mb-4">
          Author Created!
        </h1>

        <p className="text-slate-300 mb-1 text-sm sm:text-base">
          The literary world welcomes a new voice.
        </p>
        <p className="text-sky-400 font-mono text-xs sm:text-sm break-all mb-8 sm:mb-10">
          Author ID: {id}
        </p>

        <div className="space-y-4">
          <Link
            to={`/author/${id}`}
            className="block w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-400"
          >
            View Author Details
          </Link>

          <Link
            to="/"
            className="block w-full px-6 py-3 bg-slate-700 hover:bg-slate-600/90 text-slate-100 font-semibold rounded-lg shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}