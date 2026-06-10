import { useSelector } from "react-redux";

import Card from "../common/Card";
import Badge from "../common/Badge";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-black text-slate-900">My Profile</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase text-slate-400">Name</p>
          <p className="mt-1 font-black text-slate-900">{user?.name}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase text-slate-400">Email</p>
          <p className="mt-1 font-black text-slate-900">{user?.email}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase text-slate-400">Role</p>
          <div className="mt-2">
            <Badge>{user?.role}</Badge>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase text-slate-400">Status</p>
          <div className="mt-2">
            <Badge
              variant={user?.roleStatus === "approved" ? "green" : "orange"}
            >
              {user?.roleStatus}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;
