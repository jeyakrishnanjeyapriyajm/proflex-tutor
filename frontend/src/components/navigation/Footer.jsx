import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600">
              <GraduationCap />
            </div>
            <div>
              <h3 className="font-black">LearnSphere</h3>
              <p className="text-xs text-slate-400">Modern LMS Platform</p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-400">
            A role-based learning platform with user, instructor and admin
            dashboards, instructor approval workflow and secure authentication.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-bold">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>User Dashboard</li>
            <li>Instructor Dashboard</li>
            <li>Admin Approval</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold">Security</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>JWT Auth</li>
            <li>Role Protection</li>
            <li>Approval Status</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © 2026 LearnSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
