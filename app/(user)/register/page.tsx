'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUserPlus, FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from '@/app/components/ui/button';
import { useCreateUserMutation } from '@/app/store/api/authApi';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [register, { isLoading }] = useCreateUserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const payload = {
        fullname: formData.name,
        email: formData.email,
        phoneNumber: formData.phone || " ", // Handle optional phone if API requires it or just pass empty string/space
        password: formData.password
      };

      const res = await register(payload).unwrap();
      
      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: res.message,
          text: res.data?.message || 'Check your email inbox',
          confirmButtonColor: '#D4A574',
          background: '#171717',
          color: '#fff'
        }).then(() => {
           router.push('/verify-email');
        });
      }
      
    } catch (err: any) {
      console.error('Registration error:', err);
      // Try to extract error message from API response
      const errorMessage = err?.data?.message || err?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex flex-col justify-start pt-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white font-montserrat">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300 font-montserrat">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#D4A574] hover:text-[#D4A574]/80 font-montserrat">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#171717] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-900/50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="text-red-200 font-montserrat">{error}</div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 font-montserrat">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-10 sm:text-sm border-gray-600 rounded-md py-3 px-4 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                  placeholder="Input Your Name"
                />
              </div>
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
                  value={formData.email}
                  onChange={handleChange}
                  className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-10 sm:text-sm border-gray-600 rounded-md py-3 px-4 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                  placeholder="Input Your Email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-200 font-montserrat">
                Phone Number (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-10 sm:text-sm border-gray-600 rounded-md py-3 px-4 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                  placeholder="Input Your Phone Number"
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
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-10 pr-10 sm:text-sm border-gray-600 rounded-md py-3 px-4 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                  placeholder="Input Your Password"
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
              <p className="mt-1 text-xs text-gray-400 font-montserrat">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 font-montserrat">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="focus:ring-[#D4A574] focus:border-[#D4A574] block w-full pl-10 pr-10 sm:text-sm border-gray-600 rounded-md py-3 px-4 bg-gray-800 text-white placeholder-gray-400 font-montserrat"
                  placeholder="Input Your Confirm Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-[#D4A574]" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-[#D4A574]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#D4A574] focus:ring-[#D4A574] border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300 font-montserrat">
                I agree to the <a href="#" className="text-[#D4A574] hover:text-[#D4A574]/80 font-montserrat">Terms of Service</a> and{' '}
                <a href="#" className="text-[#D4A574] hover:text-[#D4A574]/80 font-montserrat">Privacy Policy</a>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D4A574] !text-black hover:bg-[#D4A574]/90 transition-all duration-300 py-3 px-4 text-sm font-medium font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                   <span className="flex items-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Creating Account...
                   </span>
                ) : (
                  <>
                    <FiUserPlus className="mr-2 h-5 w-5" />
                    Create Account
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
