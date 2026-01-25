import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  LogOut,
  Camera,
  Crop,
} from "lucide-react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import {
  userLoginSuccess,
  userLogout,
} from "../../../features/authSlice";

/* ================= IMAGE HELPERS ================= */

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = url;
  });

async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/webp")
  );
}

/* ================= COMPONENT ================= */

const FacultyProfile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxUser = useSelector((s) => s.auth.user.data);

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const fileInputRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);
  const [isAvatarViewOpen, setIsAvatarViewOpen] = useState(false);

  /* ================= FETCH FACULTY ================= */

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/faculty`,
          { credentials: "include" }
        );

        if (res.status === 401) {
          dispatch(userLogout());
          navigate("/faculty/login", { replace: true });
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setFaculty(data.data);

        if (!reduxUser && data.data?.userId) {
          dispatch(
            userLoginSuccess({
              user: data.data.userId,
              token: null,
            })
          );
        }
      } catch {
        toast.error("Failed to load faculty profile");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [dispatch, navigate]);

  /* ================= AVATAR ================= */

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const onCropSave = async () => {
    try {
      setIsAvatarUpdating(true);

      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      const fd = new FormData();
      fd.append("avatar", blob, "avatar.webp");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update-avatar`,
        { method: "POST", credentials: "include", body: fd }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      dispatch(
        userLoginSuccess({
          user: {
            ...(reduxUser || faculty?.userId || {}),
            avatar: data.data.avatar,
          },
          token: null,
        })
      );

      toast.success("Avatar updated");
      setImageSrc(null);
    } catch {
      toast.error("Avatar update failed");
    } finally {
      setIsAvatarUpdating(false);
    }
  };

  /* ================= EMAIL VERIFICATION ================= */

  const handleSendVerification = async () => {
    setVerifying(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-email-verification`,
        { method: "POST", credentials: "include" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Verification email sent");
    } catch (err) {
      toast.error(err.message || "Failed to send verification email");
    } finally {
      setVerifying(false);
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch { }
    finally {
      dispatch(userLogout());
      localStorage.clear();
      toast.success("Logged Out");
      navigate("/faculty/login", { replace: true });
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  const user = reduxUser || faculty?.userId || {};
  const institution = faculty?.institutionId || {};
  const department = faculty?.departmentId || {};
  const courses = faculty?.courses || [];

  return (
    <div className="max-w-5xl mx-auto pt-16 p-6">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div
          onClick={() => setIsAvatarViewOpen(true)}
          className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer"
        >
          <img
            src={user.avatar || "/user.png"}
            className="w-full h-full object-cover"
          />
          {isAvatarUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="animate-spin text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center">
            <Camera className="text-white w-5 h-5" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{user.name || "—"}</h1>
          <p className="text-gray-500">{user.email || "—"}</p>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <Section title="Personal Information">
        <Info label="Name" value={user.name} />
        <Info label="Email" value={user.email} />
        <Info label="Phone" value={user.phone} />

        <div>
          <label className="text-sm font-medium">Email Verification</label>
          <div className="mt-1 flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-50">
            {user.isEmailVerified ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Verified</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <button
                  onClick={handleSendVerification}
                  disabled={verifying}
                  className="text-blue-600 text-sm"
                >
                  {verifying ? "Sending..." : "Send verification"}
                </button>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* INSTITUTION INFO */}
      <Section title="Institution Information">
        <Info label="Institution" value={institution.name} />
        <Info label="Department" value={department.name} />
        <Info label="Designation" value={faculty?.designation} />
        <Info
          label="Date of Joining"
          value={
            faculty?.dateOfJoining
              ? new Date(faculty.dateOfJoining).toDateString()
              : "—"
          }
        />
        <Info
          label="In-Charge"
          value={faculty?.isInCharge ? "Yes" : "No"}
        />
      </Section>

      {/* COURSES */}
      <Section title="Courses">
        {courses.length ? (
          <div className="flex flex-wrap gap-2">
            {courses.map((c) => (
              <span
                key={c._id}
                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700"
              >
                {c.name} ({c.code})
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No courses assigned</p>
        )}
      </Section>

      {/* ACTIONS */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-6 py-2 rounded-full bg-red-600 text-white flex items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* VIEW AVATAR */}
      {isAvatarViewOpen && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center"
          onClick={() => setIsAvatarViewOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl"
          >
            <img
              src={user.avatar || "/user.png"}
              className="w-72 h-72 rounded-full object-cover"
            />
            <button
              onClick={() => {
                setIsAvatarViewOpen(false);
                fileInputRef.current.click();
              }}
              className="mt-4 w-full px-6 py-2 rounded-full bg-blue-600 text-white"
            >
              Change Avatar
            </button>
          </div>
        </div>
      )}

      {/* CROP AVATAR */}
      {imageSrc && (
        <div className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl">
            <div className="relative h-96">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex gap-4 mt-4 justify-center">
              <button
                onClick={() => setImageSrc(null)}
                className="px-6 py-2 rounded-full bg-gray-400 text-white"
              >
                Cancel
              </button>
              <button
                onClick={onCropSave}
                className="px-6 py-2 rounded-full bg-blue-600 text-white flex items-center gap-2"
              >
                <Crop size={16} /> Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".jpg,.jpeg,.png,.webp"
        onChange={onSelectFile}
      />
    </div>
  );
};

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
  <div className="mb-8 border rounded-xl p-6">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      disabled
      value={value ?? "—"}
      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
    />
  </div>
);

export default FacultyProfile;
