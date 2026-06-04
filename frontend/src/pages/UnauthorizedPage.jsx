import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/common/Button";

const Unauthorized = () => {
  return (
    <MainLayout>
      <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-xl">
          <h1 className="text-4xl font-black text-red-600">Unauthorized</h1>

          <p className="mt-4 text-slate-600">
            You do not have permission to access this page.
          </p>

          <div className="mt-8">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Unauthorized;
