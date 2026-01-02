// Header.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiBell, FiUser } from "react-icons/fi";
import { useAuthActions } from "@/app/store/hooks";
import { useGetMyProfileQuery } from "@/app/store/api/authApi";
// ...

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const { logout } = useAuthActions();

  // Using the query from profileApi as requested/modified
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { data: myProfile } = useGetMyProfileQuery(undefined);
  const user = myProfile?.data;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="px-5 py-4 md:px-10 h-16 flex justify-between items-center bg-neutral-900 border-b border-neutral-800 shadow-none">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image 
            className="md:h-12 h-8 w-auto object-contain" 
            src="/images/logo.png" 
            alt="logo image" 
            width={144} 
            height={48} 
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-5">
        {/* Notifications */}
        {/* <button className="relative bg-[#cce9ff] md:p-[13px] p-[10px] rounded-full transition">
          <FiBell className="size-6" />
          <span className="absolute top-1 right-1 bg-[#00823b] text-xs text-white px-1 rounded-full">
            3
          </span>
        </button> */}

        {/* Profile */}
        <div className="flex items-center gap-2">
          <Link href="/admin/profile" className="cursor-pointer">
            <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden relative">
               {user?.photo ? (
                  <Image 
                    src={user.photo} 
                    alt={user.fullname || 'Profile'} 
                    fill
                    className="object-cover"
                  />
               ) : (
                  <FiUser className="text-neutral-400" />
               )}
            </div>
          </Link>
          <div className="hidden md:flex flex-col items-start">
            <h3 className="text-neutral-200 text-sm">
              {user?.fullname || 'Admin User'}
            </h3>
            <p className="text-xs px-2 py-1 bg-neutral-800 text-[#D4A574] rounded">
               {/* Display role if available, or just 'Admin' or email as fallback context */}
              {user?.role || 'Admin'} 
            </p>
          </div>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 lg:hidden cursor-pointer"
        >
          {isSidebarOpen ? (
            <FiX size={20} />
          ) : (
            <FiMenu size={20} />
          )}
        </button>
      </div>
    </div>
  );
}

export default Header;
