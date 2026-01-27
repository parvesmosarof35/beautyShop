'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from '@/app/components/ui/button';
import { useLogInMutation, useGuestLoginMutation } from '@/app/store/api/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '@/app/store/authSlice';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/app/store/config/firebase';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [logIn, { isLoading: isLoginLoading }] = useLogInMutation();
  const [guestLogin, { isLoading: isGuestLoading }] = useGuestLoginMutation();
  const isLoading = isLoginLoading || isGuestLoading;

  // Prefill remembered email and preference
  useEffect(() => {
    try {
      const savedRemember = localStorage.getItem("rememberMe");
      if (savedRemember !== null) {
        setRememberMe(savedRemember === "true");
      }
      if (savedRemember === "true") {
        const savedEmail = localStorage.getItem("rememberEmail");
        if (savedEmail) setEmail(savedEmail);
        const savedPassword = localStorage.getItem("rememberPassword");
        if (savedPassword) setPassword(savedPassword);
      }
    } catch {
      // fail silently if storage is unavailable
    }
  }, []);

  const executeLogin = async (credentials: { email: string; password: string }) => {
    try {
      const response = await logIn(credentials).unwrap();

      if (response?.success && response?.data?.accessToken) {
        let decodedToken: any = null;
        try {
          decodedToken = jwtDecode(response?.data?.accessToken);
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
        }

        // Save remember preferences (only if rememberMe is checked, using current state)
        try {
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("rememberEmail", credentials.email);
            localStorage.setItem("rememberPassword", credentials.password);
          } else {
            localStorage.setItem("rememberMe", "false");
            localStorage.removeItem("rememberEmail");
            localStorage.removeItem("rememberPassword");
          }
        } catch {
          // ignore storage failures
        }

        dispatch(
          setUser({
            user: decodedToken || response?.data || {},
            token: response?.data?.accessToken,
          })
        );

        Swal.fire({
          icon: "success",
          title: "Login successful!",
          text: "You are now logged in.",
          background: '#171717',
          color: '#fff',
          confirmButtonColor: '#D4A574'
        }).then(() => {
          if (decodedToken?.role === "admin" || decodedToken?.role === "superAdmin") {
            router.push("/admin/dashboard");
          } else {
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get("redirect");
            if (redirect) {
              let target = redirect;
              try {
                target = decodeURIComponent(redirect);
              } catch {
                // ignore decoding errors
              }
              router.push(target);
            } else {
              router.push("/");
            }
          }
        });

      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Login failed!",
          background: '#171717',
          color: '#fff',
          confirmButtonColor: '#D4A574'
        });
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.data?.message || "Something went wrong! Please try again.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: !email ? "Email is required!" : "Password is required!",
      });
      return;
    }

    await executeLogin({ email, password });
  };

  const handleGuestLogin = async () => {
    try {
      let sessionId = localStorage.getItem("browser-session-id");
      if (!sessionId) {
        sessionId = `browser-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("browser-session-id", sessionId);
      }
      const response = await guestLogin({ sessionId }).unwrap();

      // Check for success and existence of nested token
      // structure: response.data.data.accessToken
      if (response?.success && response?.data?.data?.accessToken) {
        const accessToken = response.data.data.accessToken;
        let decodedToken: any = null;
        try {
          decodedToken = jwtDecode(accessToken);
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
        }

        dispatch(
          setUser({
            user: decodedToken || response?.data?.data?.user || {},
            token: accessToken,
          })
        );

        Swal.fire({
          icon: "success",
          title: "Guest Login successful!",
          text: "You are now logged in as guest.",
          background: '#171717',
          color: '#fff',
          confirmButtonColor: '#D4A574'
        }).then(() => {
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get("redirect");
          if (redirect) {
            let target = redirect;
            try {
              target = decodeURIComponent(redirect);
            } catch {
              // ignore decoding errors
            }
            router.push(target);
          } else {
            router.push("/");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response?.message || "Guest Login failed!",
          background: '#171717',
          color: '#fff',
          confirmButtonColor: '#D4A574'
        });
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Guest Login Failed",
        text: error?.data?.message || "Something went wrong! Please try again.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      // Structure data to match TUser schema for backend integration
      const backendUserData = {
        role: "user", // or "buyer" based on your constants
        email: user.email,
        fullname: user.displayName,
        photo: user.photoURL,
        isVerify: user.emailVerified,
        status: "isProgress",
        isDelete: false,
        // Add other fields as necessary or leave optional ones undefined
      };

      console.log("Structured User Data for Backend:", backendUserData);
      console.log("Firebase User Info:", user);

      // Frontend-only handling as requested
      const userInfo = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
        uid: user.uid
      };

      dispatch(
        setUser({
          user: userInfo,
          token: idToken,
        })
      );

      Swal.fire({
        icon: "success",
        title: "Login successful!",
        text: "You are now logged in with Google.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      }).then(() => {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      });

    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (error.code) console.error("Error Code:", error.code);
      if (error.message) console.error("Error Message:", error.message);

      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error?.message || "Could not sign in with Google.",
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col justify-start pt-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white font-montserrat">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300 font-montserrat">
          Or{' '}
          <Link href="/register" className="font-medium text-[#D4A574] hover:text-[#D4A574]/80 font-montserrat">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#171717] py-8 px-4 shadow sm:rounded-lg sm:px-10">

          <form className="space-y-6" onSubmit={handleSubmit}>

            <div>
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white text-black hover:bg-gray-100 transition-all duration-300 py-3 px-4 text-sm font-medium font-montserrat flex items-center justify-center border border-gray-300 mb-4"
                disabled={isLoading}
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>
              <Button
                type="button"
                onClick={handleGuestLogin}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300 py-3 px-4 text-sm font-medium font-montserrat flex items-center justify-center border border-gray-600"
                disabled={isLoading}
              >
                Sign in as Guest
              </Button>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 font-montserrat">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-10 sm:text-sm border-gray-600 rounded-md py-3 px-4 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 font-montserrat">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-10 pr-10 sm:text-sm border-gray-600 rounded-md py-3 px-4 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-[#D4A574]" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-[#D4A574]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#D4A574] focus:ring-[#D4A574] border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 font-montserrat">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#D4A574] hover:text-[#D4A574]/80 font-montserrat">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
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
                    Signing in...
                  </span>
                ) : (
                  <>
                    <FiLogIn className="mr-2 h-5 w-5" />
                    Sign in
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
