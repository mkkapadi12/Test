import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getUserProfile } from "../Store/features/user/user.auth.slice";

const PrivateStudent = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (token && !user) {
      dispatch(getUserProfile());
    }
  }, [token, user, dispatch]);

  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  if (!user) {
    return null;
  }

  return <Outlet />;
};

export default PrivateStudent;
