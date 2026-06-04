import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>

        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>

        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
