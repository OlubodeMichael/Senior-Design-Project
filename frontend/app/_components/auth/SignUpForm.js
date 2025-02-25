'use client';

import { useState } from 'react';
import Link from 'next/link';
import PasswordInput from './PasswordInput';
import TextInput from '@/app/_components/TextInput';

// Sign up form
export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Form submission logic will be added later
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                id="firstName"
                name="firstName"
                label="First name"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                autoComplete="given-name"
              />

              <TextInput
                id="lastName"
                name="lastName"
                label="Last name"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                autoComplete="family-name"
              />
            </div>

            <TextInput
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />

            <PasswordInput
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg 
                shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-colors duration-200"
            >
              Create account
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg border border-gray-300 
                bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <img
                className="h-5 w-5"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
              />
              <span className="ml-2">Google</span>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 rounded-lg border border-gray-300 
                bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <img
                className="h-5 w-5"
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub logo"
              />
              <span className="ml-2">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}    