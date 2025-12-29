import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Building2 } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((v) => !v)) {
      toast.warn("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen overflow-hidden flex items-center bg-linear-to-br from-indigo-50 via-white to-emerald-50">
      {/* Background accents */}
      <div className="absolute -top-32 -left-32 w-md h-md bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-md h-md bg-emerald-200/40 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT - DESKTOP ONLY */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Register for
            <br />
            <span className="text-indigo-600">CampusOne Access</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Create an account to access structured academic and administrative
            workflows designed for institutional governance.
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

        {/* FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="
            w-full max-w-md mx-auto
            bg-white/80 backdrop-blur-xl
            border border-slate-200
            rounded-2xl shadow-xl
            p-6 sm:p-8
          "
        >
          {/* LOGO - ALL SCREEN SIZES */}
          <div className="mb-4 text-center">
            <img
              src='./logo.png'
              alt="CampusOne"
              className="mx-auto h-10 sm:h-12 object-contain"
            />
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              CampusOne
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              icon={User}
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
            />

            <Input
              label="Official Email"
              icon={Mail}
              name="email"
              placeholder="you@institution.edu"
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              icon={Phone}
              name="phone"
              placeholder="10-digit mobile number"
              onChange={handleChange}
            />

            <Input
              label="Password"
              icon={Lock}
              name="password"
              type="password"
              placeholder="Create a strong password"
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <select
                name="role"
                onChange={handleChange}
                className="w-full cursor-pointer rounded-lg border border-slate-300 px-3 py-2.5 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select role</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
                <option value="Admin">Guard</option>
                <option value="Admin">Hostel_Staff</option>
                <option value="Admin">Club_Coordinator</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 text-white py-2.5 shadow-md hover:shadow-xl disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </motion.button>

            <p className="text-xs text-center text-slate-600">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Login here
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
    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-indigo-500 text-sm"
      />
    </div>
  </div>
);

export default Register;

