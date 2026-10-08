import {
  BookCheck,
  Calendars,
  ChartNoAxesCombined,
  House,
  ListChecks,
  LogOut,
  UserPen,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { userType } from "../../interfaces";
import { message } from "antd";
import { logoutUser } from "../../apiservices/userService";
import { useUser } from "../../hooks/useUser";

function MenuItems({ user }: { user: userType }) {
  const location = useLocation();
  const iconSize = 16;
  const currentPath = location.pathname;
  const { setCurrentUser } = useUser();

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: <House size={iconSize} />,
      isActive: currentPath === "/",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <UserPen size={iconSize} />,
      isActive: currentPath === "/profile",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: <ListChecks size={iconSize} />,
      isActive: currentPath === "/bookings",
    },
    {
      name: "Reports",
      path: "/profile/reports",
      icon: <ChartNoAxesCombined size={iconSize} />,
      isActive: currentPath === "/reports",
    },
    {
      name: "Logout",
      path: "#",
      icon: <LogOut size={iconSize} />,
      isActive: false,
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: <House size={iconSize} />,
      isActive: currentPath === "/",
    },
    {
      name: "Events",
      path: "/admin/events",
      icon: <Calendars size={iconSize} />,
      isActive: currentPath.includes("/admin/events"),
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: <BookCheck size={iconSize} />,
      isActive: currentPath.includes("/admin/bookings"),
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={iconSize} />,
      isActive: currentPath.includes("/admin/users"),
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <ChartNoAxesCombined size={iconSize} />,
      isActive: currentPath.includes("/admin/reports"),
    },
    {
      name: "Logout",
      path: "#",
      icon: <LogOut size={iconSize} />,
      isActive: false,
    },
  ];

  const menuToRender = user.isAdmin ? adminMenu : userMenu;

  const onLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null); // Clear user from global store
      message.success("Logout Successfully");
      window.location.href = "/login";
    } catch (error: any) {
      message.error(error.response?.data?.message || "Logout failed");
      setCurrentUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <div className="bg-gray-200 h-full lg:w-60 p-5">
      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-2xl font-bold text-red-500">EMS</h1>
        <span className="text-sm text-gray-600">{user.name}</span>
      </div>
      <div className="flex flex-col gap-10 mt-20">
        {menuToRender.map((item: any) => {
          const isActive = item.isActive;
          
          if (item.name === "Logout") {
            return (
              <div
                key={item.name}
                className="flex gap-5 items-center px-5 py-2 rounded cursor-pointer transition-colors hover:bg-gray-300 text-gray-700"
                onClick={onLogout}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex gap-5 items-center px-5 py-2 rounded cursor-pointer transition-colors ${
                isActive
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-300 text-gray-700"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MenuItems;