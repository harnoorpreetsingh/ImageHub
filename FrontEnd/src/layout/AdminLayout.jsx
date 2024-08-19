import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLayout = ({ Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuth");

    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Component />
    </>
  );
};
export default AdminLayout;
