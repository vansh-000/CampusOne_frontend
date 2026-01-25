import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// FACULTY
import FacultyLogin from "../pages/users/faculties/FacultyLogin";
import FacultyDashboard from "../pages/users/faculties/FacultyDashboard";
import FacultyProfile from "../pages/users/faculties/FacultyProfile";

// STUDENT
import StudentLogin from "../pages/users/students/StudentLogin";
import StudentDashboard from "../pages/users/students/StudentDashboard";
import StudentProfile from "../pages/users/students/StudentProfile";

// USER COMMON
import UserForgotPassword from "../pages/users/UserForgotPassword";
import UserResetPassword from "../pages/users/UserResetPassword";
import UserVerifyEmail from "../pages/users/UserVerifyEmail";
import NotFound from "../pages/NotFound";

import Loader from "../components/Loader.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

/* ---------- GUARDS ---------- */

// for /faculty/* and /student/* protected pages
const UserProtected = ({ children, role }) => {
  const { isAuthenticated, authChecked, data } = useSelector((s) => s.auth.user);

  if (!authChecked) return <Loader />;

  if (!isAuthenticated || data?.role !== role) {
    return <Navigate to={`/${role.toLowerCase()}/login`} replace />;
  }

  return children;
};

// for /faculty/login and /student/login (public only)
const UserAuthPublic = ({ children }) => {
  const { isAuthenticated, authChecked, data } = useSelector((s) => s.auth.user);

  if (!authChecked) return <Loader />;

  if (isAuthenticated && data?.role) {
    return <Navigate to={`/${data.role.toLowerCase()}/dashboard`} replace />;
  }

  return children;
};

/* ---------- ROUTES ---------- */

const UserRoutes = () => {
  return (
    <Routes>
      {/* ========= FACULTY AUTH ========= */}
      <Route
        path="faculty/login"
        element={
          <UserAuthPublic>
            <FacultyLogin />
          </UserAuthPublic>
        }
      />

      {/* ========= STUDENT AUTH ========= */}
      <Route
        path="student/login"
        element={
          <UserAuthPublic>
            <StudentLogin />
          </UserAuthPublic>
        }
      />

      {/* ========= FACULTY PROTECTED (WITH LAYOUT) ========= */}
      <Route
        element={
          <UserProtected role="Faculty">
            <DashboardLayout />
          </UserProtected>
        }
      >
        <Route path="faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="faculty/profile" element={<FacultyProfile />} />
      </Route>

      {/* ========= STUDENT PROTECTED (WITH LAYOUT) ========= */}
      <Route
        element={
          <UserProtected role="Student">
            <DashboardLayout />
          </UserProtected>
        }
      >
        <Route path="student/dashboard" element={<StudentDashboard />} />
        <Route path="student/profile" element={<StudentProfile />} />
      </Route>

      {/* ========= USER COMMON ========= */}
      <Route path="forgot-password" element={<UserForgotPassword />} />
      <Route path="reset-password/:token" element={<UserResetPassword />} />
      <Route path="verify-email/:token" element={<UserVerifyEmail />} />

      {/* FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
