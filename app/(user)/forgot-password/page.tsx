'use client';

import { useForgotPasswordMutation } from "@/app/store/api/authApi";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FiMail } from "react-icons/fi";
import { Button } from "@/app/components/ui/button";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const [
    forgotPassword,
    { isLoading, isSuccess, isError, error },
  ] = useForgotPasswordMutation();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your email!",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
      return;
    }

    // ✅ Trigger API call
    forgotPassword({ email });
  };

  // ✅ handle success
  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: "The OTP has been sent to your email successfully!",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      }).then(() => {
        router.push(`/otp?email=${email}`);
      });
    }
  }, [isSuccess, router, email]);

  // ✅ handle error
  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as any)?.data?.message || "Something went wrong!",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  }, [isError, error]);

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#171717] py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          
          <h2 className="text-3xl font-extrabold text-white font-montserrat mb-4">
            Forgot password?
          </h2>
          <p className="text-gray-300 font-montserrat mb-8">
            Please enter your email to get verification code
          </p>

          <form className="space-y-6" onSubmit={handleSendCode}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 font-montserrat text-left mb-1">
                Email address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-10 sm:text-sm border-gray-600 rounded-md py-3 px-4 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                  required
                />
              </div>
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#D4A574] !text-black hover:bg-[#D4A574]/90 transition-all duration-300 py-3 px-4 text-sm font-medium font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                   <span className="flex items-center justify-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Sending...
                   </span>
              ) : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
