import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Contexts
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { dashboardApi } from "@/lib/dashboardApi";
// UI Components
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import CommandPalette from '@/components/common/CommandPalette';
import CodeEditor from '@/components/CodeEditor';

// Pages
import Home from '@/pages/Home';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ChallengePage from '@/pages/ChallengePage';
import CreateChallenge from '@/pages/CreateChallenge';
import Leaderboard from '@/pages/Leaderboard';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import Leetcode from '@/pages/Leetcode';
import NotFound from '@/pages/NotFound';


// --- React Query client ---
const queryClient = new QueryClient();

// --- Protected Route ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

// --- Auth Route (redirect if logged in) ---
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

// --- App Routes ---
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public Landing / Dashboard */}
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Index />} />

      {/* Auth routes */}
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/leetcode" element={<ProtectedRoute><Leetcode /></ProtectedRoute>} />
      <Route path="/duel-editor" element={<ProtectedRoute><CodeEditor /></ProtectedRoute>} />
      <Route path="/challenge/:id" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
      <Route path="/create-challenge" element={<ProtectedRoute><CreateChallenge /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// --- Main App ---
const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CommandPalette />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;