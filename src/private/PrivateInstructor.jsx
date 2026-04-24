import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getInstructorProfile } from "../Store/features/instructor/instructor.auth.slice";

const PrivateInstructor = () => {
  const dispatch = useDispatch();
  const { token, instructor } = useSelector((state) => state.instructor);

  useEffect(() => {
    if (token && !instructor) {
      dispatch(getInstructorProfile());
    }
  }, [token, instructor, dispatch]);

  if (!token) {
    return <Navigate to="/instructor/login" replace />;
  }

  if (!instructor) {
    return null;
  }

  return <Outlet />;
};

export default PrivateInstructor;
