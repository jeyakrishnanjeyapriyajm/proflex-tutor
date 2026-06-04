import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Users, GraduationCap } from "lucide-react";
import Button from "../common/Button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
            <ShieldCheck size={16} />
            Secure Role-Based LMS Platform
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Learn, Teach and Manage with One Smart Platform
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            A professional authentication system with user, instructor and admin
            dashboards. Instructor accounts are approved by admin before getting
            dashboard access.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register">
              <Button>
                Get Started <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="light">Login</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <div className="rounded-[1.5rem] bg-white p-6 text-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">Platform Access</h3>
                <p className="text-sm text-slate-500">Role approval workflow</p>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                Active
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Normal User</h4>
                    <p className="text-xs text-slate-500">
                      Instant dashboard access
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  Approved
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Instructor</h4>
                    <p className="text-xs text-slate-500">
                      Needs admin approval
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Admin</h4>
                    <p className="text-xs text-slate-500">
                      Approves instructors
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                  Full Access
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
