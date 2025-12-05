import { useEffect } from "react"; // Added useEffect
import { Route, Routes, Navigate } from "react-router-dom"; // Added Navigate
import { Toaster } from "react-hot-toast";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";


// Import your Zustand store
import { useAuthStore } from "./store/auth";

// ------------------ PROTECTED ROUTE ------------------ //
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

// ------------------ REDIRECT AUTH USER ------------------ //
const RedirectAuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// --------------------------------------------------- //

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // 1. Check authentication on app mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 2. Show loading spinner while checking cookie
  if (isCheckingAuth) {
    return <div> Loading...</div>; // Or just <div>Loading...</div> if you don't have the component
  }

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden text-white'>

      {/* Background Shapes (Optional - from tutorial) */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-gray-900'></div>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Catch all route to redirect to home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;