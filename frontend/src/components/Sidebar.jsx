import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const linksByRole = {
    admin: [{ to: "/admin", label: "Admin Dashboard" }],
    teacher: [{ to: "/teacher", label: "Teacher Dashboard" }],
    student: [{ to: "/student", label: "Student Dashboard" }],
  };

  const links = user ? linksByRole[user.role] || [] : [];

  return (
    <aside className="w-full rounded-2xl border border-blue-100 bg-white p-4 shadow-lg lg:w-72">
      <h2 className="mb-4 text-lg font-semibold text-brand-900">Navigation</h2>

      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block rounded-xl bg-brand-50 px-4 py-3 font-medium text-brand-800 transition hover:bg-brand-100"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
