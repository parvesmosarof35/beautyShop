'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useUserVarificationMutation } from "@/app/store/api/authApi";
import { Button } from "@/app/components/ui/button";

export default function VerifyEmailPage() {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [userVarification, { isLoading, isSuccess, isError, error }] =
    useUserVarificationMutation();
  const router = useRouter();

  // Handle API response
  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        icon: "success",
        title: "Verification successful!",
        text: "Your account has been successfully verified.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      }).then(() => {
        router.push("/login"); // redirect to login or dashboard
      });
    }

    if (isError) {
      Swal.fire({
        icon: "error",
        title: "Verification failed",
        text: (error as any)?.data?.message || "Invalid code. Please try again.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  }, [isSuccess, isError, error, router]);

  const handleChange = (value: string, index: number) => {
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // auto-focus next input
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        e.preventDefault(); // Prevent default backspace behavior only if we are moving back
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        document.getElementById(`code-${index - 1}`)?.focus();
      } else {
         const newCode = [...code];
         newCode[index] = '';
         setCode(newCode);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits
    
    if (pastedData) {
      const newCode = [...code];
      const pasteLen = Math.min(pastedData.length, 6);
      for (let i = 0; i < pasteLen; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      
      // Focus the next empty field or the last field
      const nextIndex = Math.min(pasteLen, 5);
      document.getElementById(`code-${nextIndex}`)?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = code.join("");
    if (enteredCode.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid code",
        text: "Please enter a 6-digit code.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
      return;
    }

    userVarification({ verificationCode: parseInt(enteredCode, 10) });
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#171717] py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          
          <h2 className="text-3xl font-extrabold text-white font-montserrat mb-4">
            Enter Verification Code
          </h2>
          
          <p className="text-gray-300 font-montserrat mb-8">
            Please enter the 6-digit code sent to your email.
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 mb-10">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 text-2xl text-center border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] font-montserrat"
              />
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#D4A574] !text-black hover:bg-[#D4A574]/90 transition-all duration-300 py-3 px-4 text-sm font-medium font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                </span>
            ) : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  );
}
