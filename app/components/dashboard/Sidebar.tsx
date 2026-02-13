import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome, FiPackage, FiUsers, FiShoppingCart, FiSettings,
  FiDollarSign, FiLogOut, FiShield, FiFileText, FiInfo,
  FiUser, FiLock, FiX, FiMessageSquare, FiEdit3, FiStar
} from "react-icons/fi";
import { BsCollection } from "react-icons/bs";
import { useAuthActions } from "@/app/store/hooks";
import { useGetMyProfileQuery } from "@/app/store/api/authApi";
import path from "path";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuthActions();

  // Get user profile to check role
  const { data: myProfile } = useGetMyProfileQuery(undefined);
  const userRole = myProfile?.data?.role;

  const handleLogOut = () => {
    logout();
    window.location.href = '/login';
  };

  const menuItems: MenuItem[] = [
    { icon: <FiHome className="w-5 h-5" />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <BsCollection className="w-5 h-5" />, label: "Collections", path: "/admin/collections" },
    { icon: <FiPackage className="w-5 h-5" />, label: "Products", path: "/admin/products" },
    { icon: <FiUsers className="w-5 h-5" />, label: "All Users", path: "/admin/customers" },
    { icon: <FiShoppingCart className="w-5 h-5" />, label: "Orders", path: "/admin/orders" },
    { icon: <FiStar className="w-5 h-5" />, label: "Reviews", path: "/admin/reviews" },
    { icon: <FiShield className="w-5 h-5" />, label: "Admins", path: "/admin/admins" },
    { icon: <FiMessageSquare className="w-5 h-5" />, label: "Contact", path: "/admin/contact" },
    { icon: <FiEdit3 className="w-5 h-5" />, label: "Blog", path: "/admin/blog" },
    { icon: <FiEdit3 className="w-5 h-5" />, label: "Web Content", path: "/admin/web-content" },
    { icon: <FiEdit3 className="w-5 h-5" />, label: "Web Settings", path: "/admin/web-settings" },
    { icon: <FiLock className="w-5 h-5" />, label: "Privacy Policy", path: "/admin/privacy-policy" },
    { icon: <FiFileText className="w-5 h-5" />, label: "Terms & Conditions", path: "/admin/terms" },
    { icon: <FiInfo className="w-5 h-5" />, label: "About Us", path: "/admin/about-us" },
    { icon: <FiInfo className="w-5 h-5" />, label: "FAQ", path: "/admin/faq" },
    { icon: <FiUser className="w-5 h-5" />, label: "Profile", path: "/admin/profile" },
  ];

  // Filter items based on role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.label === "Admins") {
      return userRole === 'superAdmin';
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-neutral-200">
      {/* Mobile Header in Sidebar (Close Button) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-800">
        <span className="font-semibold text-neutral-400">Menu</span>
        <button
          onClick={toggleSidebar}
          className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1 custom-scrollbar">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => {
              // Close sidebar on mobile when a link is clicked
              if (window.innerWidth < 768) {
                toggleSidebar();
              }
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm group ${pathname === item.path
              ? "bg-[#D4A574] text-white shadow-lg shadow-[#D4A574]/20"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              }`}
          >
            <span className={`${pathname === item.path ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-neutral-800 mt-auto bg-neutral-900">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-lg bg-[#D4A574] text-white hover:bg-[#b88b5c] transition-colors shadow-md font-medium text-sm"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <h3 className="text-lg font-bold text-neutral-200 mb-2">
              Log out?
            </h3>
            <p className="text-sm text-neutral-400 mb-6">
              Are you sure you want to log out? You'll need to sign in again.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm text-neutral-300 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogOut}
                className="px-4 py-2 text-sm bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors shadow-lg shadow-[#D4A574]/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
