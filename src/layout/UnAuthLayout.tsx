import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "../components/consts/const";

export const UnAuthLayout = () => {
  useEffect(() => {
    window.localStorage.removeItem("authenticationToken");
    window.localStorage.removeItem("persist:authentication");
    window.localStorage.removeItem("color-theme");
  }, []);

  return (
    <>
      <div className="flex items-center justify-center h-screen ">
        <Link to={ROUTES.LOGIN_PAGE}></Link>
        <Outlet />
      </div>
    </>
  );
};
