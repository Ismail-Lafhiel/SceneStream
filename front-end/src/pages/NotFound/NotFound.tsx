import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <p className="text-2xl font-semibold text-white mt-4">Page Not Found</p>
        <p className="text-gray-400 mt-2">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
