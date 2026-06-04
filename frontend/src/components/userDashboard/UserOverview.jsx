import Card from "../common/Card";

const UserOverview = () => {
  const items = [
    ["Enrolled Courses", "04"],
    ["Completed Lessons", "18"],
    ["Certificates", "02"],
    ["Overall Progress", "64%"],
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {items.map(([label, value]) => (
        <Card key={label} className="p-6">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <h3 className="mt-3 text-3xl font-black text-slate-900">{value}</h3>
        </Card>
      ))}
    </div>
  );
};

export default UserOverview;
