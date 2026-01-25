import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const navigate = useNavigate();

  const facultyDetails = useSelector((s) => s.auth.user.data?.facultyDetails);

  const insId =
    facultyDetails?.institutionId?._id || facultyDetails?.institutionId || null;

  console.log("Id:", insId);

  // If facultyDetails not loaded yet, show loading / block UI
  if (!facultyDetails) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-600 text-white">
        Loading faculty profile...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-gray-600">
      <div className="mx-auto my-auto">
        <button onClick={() => navigate("/faculty/profile")}>Profile</button>
      </div>
    </div>
  );
};

export default FacultyDashboard;
