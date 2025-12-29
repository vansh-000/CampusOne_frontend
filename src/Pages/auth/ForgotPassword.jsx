import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Loader2, ArrowRight, ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess(true);
      toast.success("Password reset email sent");
    } catch (err) {
      toast.error(err.message || "Failed to send reset email");
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
        
        {/* LEFT CONTENT – Brand Messaging */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Account 
            <br />
            <span className="text-indigo-600">Recovery</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Forgot your credentials? No problem. Provide your institutional email, 
            and we'll guide you through the secure recovery process.
          </p>

          <div className="mt-10 space-y-4 text-slate-600">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Secure, encrypted recovery links</span>
            </div>
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              <span>Two-factor authentication ready</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT FORM – The Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto"
        >
          {/* LOGO */}
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
              Recover your account access
            </p>
          </div>

          {success ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
            >
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm leading-relaxed">
                A password reset link has been dispatched to <b>{email}</b>. 
                Please check your inbox and spam folder.
              </div>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 mx-auto text-indigo-600 font-semibold hover:underline text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Registered Email"
                icon={Mail}
                type="email"
                placeholder="you@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                    Send Reset Link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                   <ArrowLeft className="w-3 h-3" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

/* Internal Input component to maintain reference styles */
const Input = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
      />
    </div>
  </div>
);

export default ForgotPassword;