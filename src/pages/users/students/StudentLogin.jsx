import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useAuth } from "../../../providers/AuthProvider.jsx";
import Loader from "../../../components/Loader";

const StudentLogin = () => {
  const navigate = useNavigate();

  // ✅ hooks first
  const { loginUser, logoutUser } = useAuth();
  const userAuth = useSelector((s) => s.auth.user);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "" });

  // ✅ AFTER hooks, conditional returns
  if (!userAuth.authChecked) return <Loader />;

  if (userAuth.isAuthenticated && userAuth.data?.role) {
    return <Navigate to={`/${userAuth.data.role.toLowerCase()}/dashboard`} replace />;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.identifier || !form.password) {
      toast.warn("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const payload = form.identifier.includes("@")
        ? { email: form.identifier, password: form.password }
        : { phone: form.identifier, password: form.password };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      const { user, accessToken } = data.data;

      // ✅ KEPT (hard role guard - important)
      if (user.role !== "Student") {
        logoutUser();

        toast.error("Not authorized as student");
        return;
      }

      loginUser(accessToken, data);

      toast.success("Login successful");
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-linear-to-br from-indigo-50 via-white to-emerald-50 py-12">
      {/* Background accents */}
      <div className="absolute -top-32 -left-32 w-md h-md bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-md h-md bg-emerald-200/40 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome back
            <br />
            <span className="text-indigo-600">Student</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Access your academic dashboard to view courses, progress, and personalized
            learning resources.
          </p>

          <div className="mt-10 space-y-6 text-slate-600">
            <Feature icon={ShieldCheck} text="Secure student-only access" />
            <Feature icon={BookOpen} text="Course and academic tracking" />
            <Feature icon={UserCheck} text="Personalized student profile" />
          </div>
        </motion.div>

        {/* RIGHT FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-xl mx-auto"
        >
          <div className="mb-8 text-center lg:text-left">
            <img
              src="/logo.png"
              alt="CampusOne"
              className="h-24 mb-4 mx-auto object-contain"
            />
            <h2 className="text-2xl font-bold text-slate-900">Student Login</h2>
            <p className="text-slate-500 text-sm font-medium">
              Sign in using Email or Phone
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Section title="Credentials">
              <Input
                label="Email or Phone"
                icon={Mail}
                name="identifier"
                placeholder="student@email.com or 98XXXXXXXX"
                onChange={handleChange}
              />

              <Input
                label="Password"
                icon={Lock}
                name="password"
                type="password"
                placeholder="******"
                onChange={handleChange}
              />

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </Section>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white py-3 font-semibold shadow-md hover:shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- UI PRIMITIVES ---------- */

const Feature = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-indigo-100 rounded-lg">
      <Icon className="w-5 h-5 text-indigo-600" />
    </div>
    <span className="font-medium">{text}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-slate-700 ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
    </div>
  </div>
);

export default StudentLogin;
