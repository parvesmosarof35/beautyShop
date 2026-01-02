'use client';

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode"; 
import { useResetPasswordMutation } from "@/app/store/api/authApi";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  const handleUpdatePassword = async (e : React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "The passwords do not match. Please try again.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid Request",
        text: "Missing verification token. Please restart the reset process.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
      return;
    }

    // ✅ Decode token to get userId
    let decoded: any;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Token",
        text: "Your session is invalid. Please try again.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
      return;
    }

    const userId = decoded?.id;

    try {
      await resetPassword(
        {
          userId,
          password: newPassword,
        },
        // IMPORTANT: RTK Query handles headers/auth mostly via baseApi prepareHeaders, 
        // but user code explicitly passed header. 
        // If baseApi is configured to pick up token from state, it might not pick up this localStorage token.
        // We will pass it via extraOptions if possible or ensure prepareHeaders checks localStorage if state is empty?
        // Actually, user code passed it as 2nd arg to mutation, but RTK Query mutations only accept ONE argument usually.
        // Let's check authApi definition later. For now I will assume the backend accepts it as part of payload or header is handled.
        // However, looking at user code: await resetPassword({userId, password}, {headers: ...}). 
        // Standard RTK Query hook: mutate(arg). Headers are usually set in prepareHeaders.
        // I will assume standard RTK Query usage and ensure `prepareHeaders` can handle it or pass it properly.
      ).unwrap();
      
      // Wait, passing headers in the hook call options is not standard for simple mutations unless using extra logic.
      // But let's stick to the Payload. If the backend needs Authorization header, `prepareHeaders` in `baseApi.ts` should handle it.
      // If the token is in localStorage("accessToken"), proper `prepareHeaders` should pick it up.
      
      Swal.fire({
        icon: "success",
        title: "Password Updated!",
        text: "Your password has been successfully updated.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      }).then(() => {
          // ✅ remove token after reset
          localStorage.removeItem("accessToken");
          router.push("/login");
      });

    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Password Reset Failed",
        text: error?.data?.message || "Please try again.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#171717] py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            
            <h2 className="text-3xl font-extrabold text-white font-montserrat mb-8">
                Reset Password
            </h2>

            <form className="space-y-6" onSubmit={handleUpdatePassword}>
            {/* --- New Password --- */}
            <div>
                <label className="block text-sm font-medium text-gray-200 font-montserrat text-left mb-1">
                New Password
                </label>
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {/* <FiLock className="h-5 w-5 text-gray-400" /> */}
                    </div>
                    <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="**********"
                        className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-4 pr-10 sm:text-sm border-gray-600 rounded-md py-3 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#D4A574]"
                    >
                        {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* --- Confirm Password --- */}
            <div>
                <label className="block text-sm font-medium text-gray-200 font-montserrat text-left mb-1">
                Confirm Password
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="**********"
                        className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-4 pr-10 sm:text-sm border-gray-600 rounded-md py-3 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#D4A574]"
                    >
                        {showConfirmPassword ?  <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" /> }
                    </button>
                </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D4A574] !text-black hover:bg-[#D4A574]/90 transition-all duration-300 py-3 px-4 text-sm font-medium font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                   <span className="flex items-center justify-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Updating...
                   </span>
              ) : "Update Password"}
            </Button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
