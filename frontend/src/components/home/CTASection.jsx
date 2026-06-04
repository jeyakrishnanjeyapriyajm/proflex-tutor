import { Link } from "react-router-dom";
import Button from "../common/Button";

const CTASection = () => {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-br from-slate-950 to-blue-950 px-8 py-16 text-center text-white shadow-xl">
        <h2 className="text-4xl font-black">
          Start testing your authentication system
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Register as a user or instructor, then approve instructor requests
          from the admin dashboard.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/register">
            <Button>Register Now</Button>
          </Link>

          <Link to="/login">
            <Button variant="light">Login</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
