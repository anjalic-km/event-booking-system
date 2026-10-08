import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../apiservices/userService";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get current user - if successful, user is logged in
        await getCurrentUser();
        // User is authenticated, redirect to home
        navigate("/", { replace: true });
      } catch (error) {
        // User is not authenticated, show login/register page
        setShowContent(true);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return showContent ? <div>{children}</div> : null;
}

export default PublicLayout;