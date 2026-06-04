import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/common/Button";

const ApprovalPending = () => {
  return (
    <MainLayout>
      <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
            ⏳
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            Instructor Approval Pending
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Your instructor account request has been submitted. You can access
            the instructor dashboard only after admin approval.
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

export default ApprovalPending;
