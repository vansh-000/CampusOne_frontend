import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight, Building2, User } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.warn("Email and password required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      toast.success("Login successful");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-linear-to-br from-indigo-50 via-white to-emerald-50">
      {/* Background accents */}
      <div className="absolute -top-32 -left-32 w-md h-md bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-md h-md bg-emerald-200/40 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT – SAME AS SIGNUP */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome back to
            <br />
            <span className="text-indigo-600">CampusOne</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Sign in to access structured academic and administrative workflows
            built for institutional governance.
          </p>

          <div className="mt-10 space-y-4 text-slate-600">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Institution-first design</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-600" />
              <span>Role-based access control</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT FORM – SAME CARD AS SIGNUP */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto"
        >
          {/* LOGO – SAME POSITION AS SIGNUP */}
          <div className="mb-4 text-center">
            <img
              src='./logo.png'
              alt="CampusOne"
              className="mx-auto h-10 sm:h-12 object-contain"
            />
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              CampusOne
            </h2>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              icon={Mail}
              name="email"
              placeholder="you@institution.edu"
              onChange={handleChange}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                icon={Lock}
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
              />
              <div className="flex justify-end px-1">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white py-2.5 font-semibold shadow-md hover:shadow-xl disabled:opacity-60"
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

            <p className="text-xs text-center text-slate-600">
              New user?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const Input = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>
);

export default Login;
