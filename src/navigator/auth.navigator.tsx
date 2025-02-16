import { useEffect } from "react";
import { useSelector } from "react-redux";
import {  useLocation, useNavigate, Outlet } from "react-router-dom";
import { ROUTES } from "../components/consts/const";
import {
  selectAuthMe ,
  selectIsLoggedIn,
} from "../store/selectors/auth.selector";
import Loader from "../components/Loader";

export const AuthNavigator = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const authMe = useSelector(selectAuthMe);
  const role = authMe?.user?.role;
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN_PAGE, { replace: true });
      return;
    }

    if (role) {
      const basePath = role === 'admin' 
        ? ROUTES.ADMIN_DASHBOARD 
        : ROUTES.SUPER_ADMIN_DASHBOARD;

      // Only redirect if on root path or loading
      if (location.pathname === ROUTES.LOADING || location.pathname === '/') {
        navigate(basePath, { replace: true });
      }
    }
  }, [isLoggedIn, role, navigate, location]);

  if (!role) return <Loader />;

  return <Outlet />; // This renders matched child routes
};