import LoginForm from '@/app/_components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 select-none">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-10 -top-10 w-48 sm:w-64 h-48 sm:h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -right-10 -top-10 w-48 sm:w-64 h-48 sm:h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/2 bottom-0 w-48 sm:w-64 h-48 sm:h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with logo */}
      <div className="relative z-10">
        <div className="fixed top-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-[400px] mx-auto px-4">
            <Link 
              href="/" 
              className="inline-block text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              CollabFlow
            </Link>
          </div>
        </div>

        {/* Login Form */}
        <div className="pt-20 pb-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
