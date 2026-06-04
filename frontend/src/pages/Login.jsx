import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import { loginSuccess } from "../features/auth/authSlice";
import { getDashboardPath } from "../utils/redirectByRole";
import Button from "../components/common/Button";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
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

      const { data } = await API.post("/auth/login", form);

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
      <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl">
          <h1 className="mb-2 text-3xl font-black text-slate-900">
            Welcome back
          </h1>

          <p className="mb-6 text-slate-500">Login to access your dashboard.</p>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{" "}
            <Link to="/register" className="font-bold text-blue-600">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Login;
