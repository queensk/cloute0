import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../auth/authSlice";
import { RootState } from "../../Redux/store";

const RequireAuth: React.FC = () => {
  const token: string | null = useSelector((state: RootState) =>
    selectToken(state)
  );
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
