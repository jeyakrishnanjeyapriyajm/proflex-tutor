import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";

const RoleSection = () => {
  const roles = [
    {
      title: "User",
      desc: "Normal users can access their dashboard, courses, profile and learning progress.",
      badge: "Instant Access",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Instructor",
      desc: "Instructors can manage courses and students only after admin approval.",
      badge: "Approval Required",
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "Admin",
      desc: "Admins can approve instructors, manage users and control platform sections.",
      badge: "Full Control",
      color: "bg-red-50 text-red-700",
    },
  ];

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="User Roles"
          title="Three dashboards, one smooth system"
          description="Each role has a separate experience with protected navigation."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.title} className="p-8">
              <span
                className={`mb-5 inline-flex rounded-full px-4 py-2 text-sm font-bold ${role.color}`}
              >
                {role.badge}
              </span>

              <h3 className="mb-3 text-2xl font-black text-slate-900">
                {role.title} Dashboard
              </h3>

              <p className="leading-7 text-slate-600">{role.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleSection;
