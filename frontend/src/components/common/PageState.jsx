import Loading from "./Loading";
import Card from "./Card";

const PageState = ({ loading, error, onRetry, children }) => {
  if (loading) {
    return <Loading text="Loading data..." />;
  }

  if (error) {
    return (
      <Card className="p-8">
        <h2 className="text-xl font-black text-red-600">Failed to load data</h2>
        <p className="mt-2 text-slate-500">{error}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-5 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white"
          >
            Try Again
          </button>
        )}
      </Card>
    );
  }

  return children;
};

export default PageState;
