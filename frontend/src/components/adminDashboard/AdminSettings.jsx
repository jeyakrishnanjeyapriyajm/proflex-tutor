import Card from "../common/Card";

const AdminSettings = () => {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-black text-slate-900">Admin Settings</h2>

      <p className="mt-2 text-slate-500">
        Later you can add approval rules, notification settings and platform
        configurations here.
      </p>
    </Card>
  );
};

export default AdminSettings;
