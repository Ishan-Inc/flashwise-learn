
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { FlashcardProvider } from "@/hooks/useFlashcards";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Study from "./pages/Study";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const queryClient = new QueryClient();

const LoginPage = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <LoginForm />
    </main>
    <Footer />
  </div>
);

const SignupPage = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <SignupForm />
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FlashcardProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/study" element={<Study />} />
              <Route path="/create" element={<Create />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FlashcardProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
