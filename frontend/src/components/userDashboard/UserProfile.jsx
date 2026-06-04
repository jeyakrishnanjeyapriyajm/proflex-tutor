import { useSelector } from "react-redux";

import Card from "../common/Card";
import Badge from "../common/Badge";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-black text-slate-900">My Profile</h2>

      <div className="mt-6 space-y-4">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Role:</strong> <Badge>{user?.role}</Badge>
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <Badge variant={user?.roleStatus === "approved" ? "green" : "orange"}>
            {user?.roleStatus}
          </Badge>
        </p>
      </div>
    </Card>
  );
};

export default UserProfile;
