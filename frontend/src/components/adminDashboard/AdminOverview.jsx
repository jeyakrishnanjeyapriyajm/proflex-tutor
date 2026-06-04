import Card from "../common/Card";

const AdminOverview = () => {
  const stats = [
    ["Total Users", "120"],
    ["Pending Instructors", "08"],
    ["Approved Instructors", "24"],
    ["Active Courses", "32"],
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {stats.map(([label, value]) => (
        <Card key={label} className="p-6">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <h3 className="mt-3 text-3xl font-black text-slate-900">{value}</h3>
        </Card>
      ))}
    </div>
  );
};

export default AdminOverview;
