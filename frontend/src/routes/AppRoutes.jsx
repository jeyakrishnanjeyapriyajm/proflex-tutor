import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ApprovalPending from "../pages/ApprovalPending";
import Unauthorized from "../pages/Unauthorized";

import AdminDashboard from "../pages/AdminDashboard";
import InstructorDashboard from "../pages/InstructorDashboard";
import UserDashboard from "../pages/UserDashboard";

import RoleRoute from "../components/auth/RoleRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/approval-pending" element={<ApprovalPending />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/admin-dashboard"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/instructor-dashboard"
        element={
          <RoleRoute allowedRoles={["instructor"]} requireApproved={true}>
            <InstructorDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/user-dashboard"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <UserDashboard />
          </RoleRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
