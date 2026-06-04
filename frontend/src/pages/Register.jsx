import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import { loginSuccess } from "../features/auth/authSlice";
import { getDashboardPath } from "../utils/redirectByRole";
import Button from "../components/common/Button";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await API.post("/auth/register", form);

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        }),
      );

      navigate(getDashboardPath(data.user));
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-blue-700 to-slate-950 p-10 text-white md:block">
            <h2 className="text-4xl font-black">
              Create your learning account
            </h2>

            <p className="mt-4 leading-7 text-blue-100">
              Register as a normal user or request instructor access. Instructor
              accounts must be approved by admin before dashboard access.
            </p>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <h3 className="font-bold">User</h3>
                <p className="text-sm text-blue-100">Instant access</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <h3 className="font-bold">Instructor</h3>
                <p className="text-sm text-blue-100">Needs admin approval</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <h1 className="mb-2 text-3xl font-black text-slate-900">
              Register
            </h1>

            <p className="mb-6 text-slate-500">
              Create your account to continue.
            </p>

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                type="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                type="password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="user">Normal User</option>
                <option value="instructor">Instructor</option>
              </select>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-blue-600">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Register;
