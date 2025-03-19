
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Types
interface AuthUser {
  id: string;
  username: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (data: { username?: string; profilePicture?: string }) => Promise<void>;
  isLoading: boolean;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert Supabase User to AuthUser
const formatUser = (user: User | null, profile?: any): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    username: profile?.username || user.email || 'Anonymous User',
    profilePicture: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || user.email || 'Anonymous')}&background=random`
  };
};

// Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Get user profile data from Supabase
  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };
  
  // Check for session on mount and set up auth state listener
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const profile = await getUserProfile(session.user.id);
            setUser(formatUser(session.user, profile));
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      );
      
      // Set initial user if session exists
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setUser(formatUser(session.user, profile));
      }
      
      setIsLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);
  
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        const profile = await getUserProfile(data.user.id);
        setUser(formatUser(data.user, profile));
        
        toast({
          title: "Logged In",
          description: `Welcome back, ${profile?.username || data.user.email}!`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) throw error;
      
      // No need to set user here - the onAuthStateChange listener will handle that
      toast({
        title: "Redirecting to Google",
        description: "Please complete the authentication process.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message || "There was a problem with Google login.",
      });
      throw error;
    }
  };
  
  const signup = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0],
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // The trigger will create the profile
        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "Registration failed. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (data: { username?: string; profilePicture?: string }): Promise<void> => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }
      
      setIsLoading(true);
      
      const updates = {
        id: user.id,
        username: data.username,
        avatar_url: data.profilePicture,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        username: data.username || user.username,
        profilePicture: data.profilePicture || user.profilePicture,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "Failed to log out. Please try again.",
      });
      throw error;
    }
  };
  
  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    signup,
    logout,
    isAuthenticated: !!user,
    updateProfile,
    isLoading,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
