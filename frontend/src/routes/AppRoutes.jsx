import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ApprovalPending from "../pages/ApprovalPending";
import Unauthorized from "../pages/Unauthorized";

import Features from "../pages/Features";
import HowItWorks from "../pages/HowItWorks";
import Curriculum from "../pages/Curriculum";
import About from "../pages/About";

import StudentDashboard from "../pages/StudentDashboard";
import StudentAnalytics from "../pages/StudentAnalytics";
import StudentWorkspace from "../pages/StudentWorkspace";
import StudentCurriculum from "../pages/StudentCurriculum";
import StudentAssessment from "../pages/StudentAssessment";
import StudentResources from "../pages/StudentResources";
import StudentMessages from "../pages/StudentMessages";
import StudentSettings from "../pages/StudentSettings";

import AdminDashboard from "../pages/AdminDashboard";

import InstructorDashboard from "../pages/InstructorDashboard";
import LecturerAnalytics from "../pages/LecturerAnalytics";
import LecturerContent from "../pages/LecturerContent";
import LecturerQuestionBank from "../pages/LecturerQuestionBank";
import LecturerSettings from "../pages/LecturerSettings";
import LecturerStudents from "../pages/LecturerStudents";

import RoleRoute from "../components/auth/RoleRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/curriculum" element={<Curriculum />} />
      <Route path="/about" element={<About />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />

      <Route
        path="/register/student"
        element={<Register defaultRole="user" />}
      />

      <Route
        path="/register/lecturer"
        element={<Register defaultRole="instructor" />}
      />

      <Route
        path="/register"
        element={<Navigate to="/register/student" replace />}
      />

      <Route path="/approval-pending" element={<ApprovalPending />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Student Portal */}
      <Route
        path="/student/dashboard"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <StudentDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/student/analytics"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <StudentAnalytics />
          </RoleRoute>
        }
      />

      <Route
        path="/student/workspace"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <StudentWorkspace />
          </RoleRoute>
        }
      />

      <Route
        path="/student/curriculum"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <StudentCurriculum />
          </RoleRoute>
        }
      />

      <Route
        path="/student/assessment"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <StudentAssessment />
          </RoleRoute>
        }
      />

      <Route
        path="/student/resources"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <StudentResources />
          </RoleRoute>
        }
      />

      <Route
        path="/student/messages"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <StudentMessages />
          </RoleRoute>
        }
      />

      <Route
        path="/student/settings"
        element={
          <RoleRoute allowedRoles={["user", "admin", "instructor"]}>
            <StudentSettings />
          </RoleRoute>
        }
      />

      {/* Admin Portal */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleRoute>
        }
      />

      {/* Old route redirects */}
      <Route
        path="/user-dashboard"
        element={<Navigate to="/student/dashboard" replace />}
      />

      <Route
        path="/admin-dashboard"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      {/* Lecturer / Instructor Portal */}
      <Route
        path="/lecturer/dashboard"
        element={
          <RoleRoute allowedRoles={["instructor", "admin"]}>
            <InstructorDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/lecturer/analytics"
        element={
          <RoleRoute allowedRoles={["instructor", "admin"]}>
            <LecturerAnalytics />
          </RoleRoute>
        }
      />

      <Route
        path="/lecturer/content"
        element={
          <RoleRoute allowedRoles={["instructor", "admin"]}>
            <LecturerContent />
          </RoleRoute>
        }
      />

      <Route
        path="/lecturer/question-bank"
        element={
          <RoleRoute allowedRoles={["instructor", "admin"]}>
            <LecturerQuestionBank />
          </RoleRoute>
        }
      />

      <Route
        path="/lecturer/students"
        element={
          <RoleRoute allowedRoles={["instructor", "admin"]}>
            <LecturerStudents />
          </RoleRoute>
        }
      />

      <Route
        path="/lecturer/settings"
        element={
          <RoleRoute allowedRoles={["instructor", "admin"]}>
            <LecturerSettings />
          </RoleRoute>
        }
      />

      <Route
        path="/lecturer"
        element={<Navigate to="/lecturer/dashboard" replace />}
      />

      <Route
        path="/instructor-dashboard"
        element={<Navigate to="/lecturer/dashboard" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<Unauthorized />} />
    </Routes>
  );
};

export default AppRoutes;
