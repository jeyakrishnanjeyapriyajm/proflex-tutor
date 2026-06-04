import Card from "../common/Card";

const AdminUsers = () => {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-black text-slate-900">User Management</h2>

      <p className="mt-2 text-slate-500">
        Later you can add user list, search, filters, role update and account
        status management here.
      </p>
    </Card>
  );
};

export default AdminUsers;
