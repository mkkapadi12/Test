import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getAdminProfile } from "../Store/features/admin/admin.auth.slice";

const PrivateAdmin = () => {
  const dispatch = useDispatch();
  const { token, admin, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (token && !admin) {
      dispatch(getAdminProfile());
    }
  }, [token, admin, dispatch]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!admin) {
    return null;
  }

  return <Outlet />;
};

export default PrivateAdmin;
