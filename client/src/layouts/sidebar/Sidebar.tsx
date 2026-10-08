import { Menu } from "lucide-react";
import type { userType } from "../../interfaces";
import MenuItems from "./MenuItems";
import { useState } from "react";
import { Drawer } from "antd";

function Sidebar({ user }: { user: userType }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <div>
      <div className="lg:flex hidden h-full lg:w-60">
        <MenuItems user={user} />
      </div>
      <div className="bg-red-500 p-5 lg:hidden flex">
        <Menu
          size={20}
          color="white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="curser-pointer"
        />
      </div>
      {showMobileMenu && (
        <Drawer open={showMobileMenu} placement="left" onClose={() => setShowMobileMenu(false)}>
          <MenuItems user={user} />
        </Drawer>
      )}
    </div>
  );
}

export default Sidebar;
