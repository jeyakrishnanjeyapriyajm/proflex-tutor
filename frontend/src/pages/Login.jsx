import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BrainCircuit, ShieldCheck } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import { loginSuccess } from "../features/auth/authSlice";
import { getDashboardPath } from "../utils/redirectByRole";
import Button from "../components/common/Button";

const Login = () => {
  const [form, setForm] = useState({
    loginEmail: "",
    loginPassword: "",
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

      const { data } = await API.post("/auth/login", {
        email: form.loginEmail,
        password: form.loginPassword,
      });

      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        }),
      );

      navigate(getDashboardPath(data.user));
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-16">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />

        <div className="relative w-full max-w-md">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-600 text-white shadow-xl shadow-sky-200">
              <BrainCircuit size={32} />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Sign in to continue to your ProgFlex dashboard.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur-xl md:p-10">
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">
                  Secure Login
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Access your role-based dashboard
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              autoComplete="off"
            >
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  name="loginEmail"
                  value={form.loginEmail}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  type="email"
                  autoComplete="new-email"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-50"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Password
                </label>
                <input
                  name="loginPassword"
                  value={form.loginPassword}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-50"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full py-4">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Do not have an account?{" "}
              <Link to="/register" className="font-bold text-sky-600">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Login;
