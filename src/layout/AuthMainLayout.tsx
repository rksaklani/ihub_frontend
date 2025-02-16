import React, { useState, ReactNode } from "react";
import SuperAdminSideBar from "../components/Sidebar/SuperAdminSideBar";
import AdminSideBar from "../components/Sidebar/AdminSideBar";
import { ROUTES } from "../components/consts/const";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/selectors/auth.selector";
import AdminHeader from "../components/Header/AdminHeader";
import SuperAdminHeader from "../components/Header/SuperAdminHeader";

const AuthMainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const role = useSelector(
    (state: any) => state?.authentication?.me?.user.role
  );
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
        {isLoggedIn ? (
          role === "admin" ? (
            <AdminSideBar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          ) : role === "superadmin" ? (
            <SuperAdminSideBar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          ) : (
            <Navigate to={ROUTES.LOGIN_PAGE} replace />
          )
        ) : (
          <Navigate to={ROUTES.LOGIN_PAGE} replace />
        )}

        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          {isLoggedIn ? (
            role === "admin" ? (
              <AdminHeader
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            ) : role === "superadmin" ? (
              <SuperAdminHeader
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            ) : (
              <Navigate to={ROUTES.LOGIN_PAGE} replace />
            )
          ) : (
            <Navigate to={ROUTES.LOGIN_PAGE} replace />
          )}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default AuthMainLayout;
