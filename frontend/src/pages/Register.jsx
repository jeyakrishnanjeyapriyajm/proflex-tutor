import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BrainCircuit, Code2, GraduationCap, ShieldCheck } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import { loginSuccess } from "../features/auth/authSlice";
import { getDashboardPath } from "../utils/redirectByRole";
import Button from "../components/common/Button";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    registerEmail: "",
    registerPassword: "",
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

  const handleRoleChange = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await API.post("/auth/register", {
        name: form.fullName,
        email: form.registerEmail,
        password: form.registerPassword,
        role: form.role,
      });

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
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-16">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />

        <div className="relative w-full max-w-xl">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-600 text-white shadow-xl shadow-sky-200">
              <BrainCircuit size={32} />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Join ProgFlex Tutor and start your C programming learning journey.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur-xl md:p-10">
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">
                  Secure Registration
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Student and instructor account access
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
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  type="text"
                  autoComplete="off"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-50"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  name="registerEmail"
                  value={form.registerEmail}
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
                  name="registerPassword"
                  value={form.registerPassword}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-50"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Register As
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("user")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      form.role === "user"
                        ? "border-sky-500 bg-sky-50 ring-4 ring-sky-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                      <Code2 size={20} />
                    </div>

                    <p className="font-black text-slate-900">Student</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Start learning C programming.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange("instructor")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      form.role === "instructor"
                        ? "border-orange-500 bg-orange-50 ring-4 ring-orange-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                      <GraduationCap size={20} />
                    </div>

                    <p className="font-black text-slate-900">Instructor</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Requires admin approval.
                    </p>
                  </button>
                </div>

                {form.role === "instructor" && (
                  <p className="mt-3 rounded-2xl bg-orange-50 px-4 py-3 text-xs font-semibold text-orange-700">
                    Instructor access will be pending until admin approval.
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full py-4">
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-sky-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Register;
