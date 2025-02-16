import { Outlet } from "react-router-dom";
import AuthMainLayout from "./AuthMainLayout";


export const AuthLayout = () => {
  return (
    <>
      <AuthMainLayout>
        <Outlet />
      </AuthMainLayout>
    </>
  );
};
