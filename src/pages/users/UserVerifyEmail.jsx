import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function UserVerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user.data);
  if (!user?.role) return null;

  const role = user.role.toLowerCase(); // safety

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-email/${token}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        toast.success("Email verified. Please login.");
        setTimeout(() => navigate(`/${role}/login`), 2500);
      } catch (err) {
        toast.error(err.message);
        setTimeout(() => navigate(`/${role}/login`), 3000);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
    </div>
  );
}
