import Card from "../common/Card";

const InstructorOverview = () => {
  const cards = [
    ["My Courses", "06"],
    ["Students", "148"],
    ["Assignments", "24"],
    ["Completion", "82%"],
  ];

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {cards.map(([label, value]) => (
        <Card key={label} className="p-6">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <h3 className="mt-3 text-3xl font-black text-slate-900">{value}</h3>
        </Card>
      ))}
    </div>
  );
};

export default InstructorOverview;
