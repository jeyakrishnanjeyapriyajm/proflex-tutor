import { Lock, UserCheck, LayoutDashboard } from "lucide-react";
import SectionHeader from "../common/SectionHeader";
import Card from "../common/Card";

const FeatureSection = () => {
  const features = [
    {
      icon: Lock,
      title: "Secure Authentication",
      desc: "JWT based authentication with protected frontend routes and backend APIs.",
    },
    {
      icon: UserCheck,
      title: "Admin Approval",
      desc: "Instructor accounts stay pending until an admin approves the request.",
    },
    {
      icon: LayoutDashboard,
      title: "Role Dashboards",
      desc: "Separate dashboards for user, instructor and admin with clean sections.",
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Core Features"
          title="Built for a professional learning platform"
          description="This frontend structure is clean, scalable and easy to update later."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={26} />
                </div>

                <h3 className="mb-3 text-xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="leading-7 text-slate-600">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
