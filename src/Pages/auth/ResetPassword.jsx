import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setSuccess(true);
      toast.success("Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message || "Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-linear-to-br from-indigo-50 via-white to-emerald-50 overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-32 -left-32 w-md h-md bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-md h-md bg-emerald-200/40 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT – Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Secure your
            <br />
            <span className="text-indigo-600">Credentials</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Update your password to maintain the integrity of your institutional account 
            and access to the CampusOne dashboard.
          </p>

          <div className="mt-10 space-y-4 text-slate-600">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Password complexity enforcement</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>Instant security synchronization</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT FORM – Reset Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto"
        >
          <div className="mb-6 text-center">
            <img src="/logo.png" alt="CampusOne" className="mx-auto h-10 sm:h-12 object-contain" />
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">New Password</h2>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm font-medium">
              Create a strong password for your account
            </p>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-800">
                Password reset successful! 
                <br />
                <span className="text-slate-500 font-normal">Redirecting you to login...</span>
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />

              <Input
                label="Confirm Password"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white py-2.5 font-semibold shadow-md hover:shadow-xl disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
              
              <p className="text-xs text-center text-slate-500">
                Need help? <Link to="/support" className="text-indigo-600 font-medium hover:underline">Contact Support</Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* Matches Login.jsx Input styling */
const Input = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
    </div>
  </div>
);

export default ResetPassword;
