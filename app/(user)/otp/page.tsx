'use client';

import { useForgotPasswordMutation, useVerifyEmailMutation } from "@/app/store/api/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import Swal from "sweetalert2";
import { Button } from "@/app/components/ui/button";

function VerificationCodeContent() {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  // resend mutation
  const [
    forgotPassword,
    {
        isLoading: isResending,
        isSuccess: resendSuccess,
        isError: resendError,
        error: resendErr
    },
  ] = useForgotPasswordMutation();

  // verify mutation
  const [
    verifyEmail,
    {
      data: verifyData,
      isLoading: isVerifying,
      isSuccess: verifySuccess,
      isError: verifyError,
      error: verifyErr,
    },
  ] = useVerifyEmailMutation();

  // handle resend toast
  useEffect(() => {
    if (resendSuccess) {
      Swal.fire({
        icon: "success",
        title: "OTP Resent",
        text: "A new OTP has been sent to your email.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
    if (resendError) {
      Swal.fire({
        icon: "error",
        title: "Resend Failed",
        text: (resendErr as any)?.data?.message || "Could not resend OTP.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  }, [resendSuccess, resendError, resendErr]);

  // handle verify toast + token save
  useEffect(() => {
    if (verifySuccess && verifyData) {
      const token = verifyData?.data; 
      
      if (token) {
        localStorage.setItem("accessToken", token);
        router.push("/reset-password");
      }

      Swal.fire({
        icon: "success",
        title: "Verification successful!",
        text: "Your email has been successfully verified.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }

    if (verifyError) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: (verifyErr as any)?.data?.message || "Invalid code. Please try again.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  }, [verifySuccess, verifyError, verifyErr, verifyData, router]);

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
        e.preventDefault();
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
        e.preventDefault();
      document.getElementById(`code-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
        e.preventDefault();
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); 
    
    if (pastedData) {
      const newCode = [...code];
      const pasteLen = Math.min(pastedData.length, 6);
      for (let i = 0; i < pasteLen; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      
      const nextIndex = Math.min(pasteLen, 5);
      document.getElementById(`code-${nextIndex}`)?.focus();
    }
  };

  const enteredCode = code.join("");

  const handleVerifyCode = () => {
    if (enteredCode.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid 6-digit code.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
      return;
    }

    const numberedCode = parseInt(enteredCode, 10);
    const payload = { verificationCode: numberedCode };
    verifyEmail(payload); 
  };

  const handleResend = () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No email found. Please go back and try again.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
      return;
    }
    // clear input boxes on resend
    setCode(new Array(6).fill(""));
    setTimeout(() => {
      document.getElementById("code-0")?.focus();
    }, 0);
    forgotPassword({ email });
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#171717] py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          
          <h2 className="text-3xl font-extrabold text-white font-montserrat mb-4">
            Check your email
          </h2>
          <p className="text-gray-300 font-montserrat mb-8">
            Please enter the 6-digit verification code we sent to your email.
          </p>

          <form className="space-y-6">
            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                {code.map((digit, index) => (
                <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-2xl text-center border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] font-montserrat"
                />
                ))}
            </div>

            <Button
              onClick={handleVerifyCode}
              disabled={isVerifying}
              type="button"
              className="w-full bg-[#D4A574] !text-black hover:bg-[#D4A574]/90 transition-all duration-300 py-3 px-4 text-sm font-medium font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                  <span className="flex items-center justify-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Verifying...
                   </span>
              ) : "Continue"}
            </Button>
            
            <p className="text-gray-400 text-center mt-6 text-sm font-montserrat">
              Didn’t receive the email?{" "}
              <button
                type="button"
                className="text-[#D4A574] hover:text-[#D4A574]/80 font-medium ml-1"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerificationCodePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#272727] flex items-center justify-center text-white">Loading...</div>}>
            <VerificationCodeContent />
        </Suspense>
    )
}
