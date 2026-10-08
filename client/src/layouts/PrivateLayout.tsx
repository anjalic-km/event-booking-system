import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import { getCurrentUser } from "../apiservices/userService";
import { message } from "antd";
import { useUser } from "../hooks/useUser";
import Spinner from "../components/Spinner";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        setCurrentUser(response.data);
        setLoading(false);
      } catch (error: any) {
        message.error(
          error.response?.data?.message || "Please login to continue",
        );
        navigate("/login", { replace: true });
      }
    };

    // Only fetch user if not already in store
    if (!currentUser) {
      checkAuth();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex gap-5 h-screen">
      <Sidebar user={currentUser} />
      <div className="flex-1 px-5 pb-10">{children}</div>
    </div>
  );
}

export default PrivateLayout;
