import { getAdminProfile } from "@/Store/features/admin/admin.auth.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminProfile = () => {
  return <div>Profile : {admin?.name}</div>;
};

export default AdminProfile;
