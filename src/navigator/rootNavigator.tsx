// import  { useEffect, useRef } from "react";
import {
  Route,
  Routes,
  Navigate,
  // useLocation,
  // useNavigate,
} from "react-router-dom";
import { ROUTES } from "../components/consts/const";
// import PageTitle from '../components/PageTitle';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  selectAuthMe,
  selectIsLoggedIn,
} from "../store/selectors/auth.selector";

// import { useLazyGetLoginQuery } from "../store/api/auth/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { AuthLayout } from "../layout/AuthLayout";
import { AuthNavigator } from "./auth.navigator";
// // import { useSessionUser } from "../store/hooks/session.hook";
import { UnAuthLayout } from "../layout/UnAuthLayout";
import Loader from "../components/Loader";
// import Dashboard from "../pages/Admin/AdminDashboard/AdminDashbord";
import { SuperAdminDashboard } from "../pages/superAdmin/SuperAdminDashboard/SuperAdminDashboard";
// import Settings from "../pages/Admin/AdminSettings/Settings";

// import { AddAdminProducts, BuyNewAdminProducts, AdminProfile, TotalAdminProducts} from "../pages/Admin";
import {
  AddSuperAdminProducts,
  // BuyNewSuperAdminProducts,
  SuperAdminProfile,
  TotalSuperAdminProducts,
} from "../pages/superAdmin";
import { SignIn, SignUp } from "../pages/Authentication/index";
import SuperAdminSettings from "../pages/superAdmin/SuperAdminSettings/SuperAdminSettings";
import { AddAdminProducts, AdminProfile,  TotalAdminProducts } from "../pages";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashbord";
import AdminSettings from "../pages/Admin/AdminSettings/AdminSettings";


const RootNavigator = () => {
  ;
  const role = useSelector(
    (state: any) => state?.authentication?.me?.user?.role
  );
  const isAuthenticated = useSelector(selectIsLoggedIn);

  const redirectBasedOnRole = () => {
    if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN_PAGE} replace />;

    switch (role) {
      case "admin":
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case "superadmin":
        return <Navigate to={ROUTES.SUPER_ADMIN_DASHBOARD} replace />;
      default:
        return <Navigate to={ROUTES.LOGIN_PAGE} replace />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column",  height: "100vh" }}>
      <Routes>
        {/* Public Routes */}
        <Route element={<UnAuthLayout />}>
          <Route path={ROUTES.LOGIN_PAGE} element={<SignIn />} />
          <Route path={ROUTES.SIGNUP_PAGE} element={<SignUp />} />
        </Route>

        {/* Loading Route */}
        <Route path={ROUTES.LOADING} element={<Loader />} />

        {/* Protected Routes */}
        <Route element={<AuthLayout />}>
          <Route element={<AuthNavigator />}>
            {/* Common Authenticated Routes */}
            {/* <Route path={ROUTES.LOADING} element={<Loader />} /> */}

            {/* Admin Routes */}
            {role === "admin" && (
              <>
                <Route
                  path={ROUTES.ADMIN_DASHBOARD}
                  element={<AdminDashboard />}
                />
                <Route
                  path={ROUTES.ADD_ADMIN_PRODUCTS}
                  element={<AddAdminProducts />}
                />
                
                <Route
                  path={ROUTES.TOTAL_ADMIN_PRODUCTS}
                  element={<TotalAdminProducts />}
                />
                <Route
                  path={ROUTES.ADMIN_SETTINGS}
                  element={<AdminSettings />}
                />
                <Route
                  path={ROUTES.ADMIN_PROFILE}
                  element={<AdminProfile />}
                />
              </>
            )}
            {/* Superadmin Routes */}
            {role === "superadmin" && (
              <>
                <Route
                  path={ROUTES.SUPER_ADMIN_DASHBOARD}
                  element={<SuperAdminDashboard />}
                />
                <Route
                  path={ROUTES.ADD_SUPER_ADMIN_PRODUCTS}
                  element={<AddSuperAdminProducts />}
                />
                <Route
                  path={ROUTES.SUPER_ADMIN_PROFILE}
                  element={<SuperAdminProfile />}
                />
                <Route
                  path={ROUTES.TOTAL_SUPER_ADMIN_PRODUCTS}
                  element={<TotalSuperAdminProducts />}
                />
                <Route
                  path={ROUTES.SUPER_ADMIN_SETTINGS}
                  element={<SuperAdminSettings />}
                />
              </>
            )}
            {/* Default Redirect */}
            <Route index element={redirectBasedOnRole()} />
          </Route>
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={redirectBasedOnRole()} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default RootNavigator;
