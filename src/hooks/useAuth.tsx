
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

// Types
interface User {
  id: string;
  username: string;
}

interface UserCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for demo purposes
const getUserDatabase = (): UserCredentials[] => {
  const savedUsers = localStorage.getItem("users");
  if (savedUsers) {
    return JSON.parse(savedUsers);
  }
  
  // Create sample user
  const sampleUsers: UserCredentials[] = [
    {
      username: "demo",
      password: "password",
    },
  ];
  
  localStorage.setItem("users", JSON.stringify(sampleUsers));
  return sampleUsers;
};

// Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (err) {
        console.error("Failed to parse user data:", err);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);
  
  const login = async (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        try {
          const users = getUserDatabase();
          const user = users.find(
            (u) => u.username === username && u.password === password
          );
          
          if (user) {
            const userData: User = {
              id: uuidv4(),
              username: user.username,
            };
            
            setUser(userData);
            localStorage.setItem("currentUser", JSON.stringify(userData));
            resolve();
          } else {
            reject(new Error("Invalid username or password"));
          }
        } catch (err) {
          reject(new Error("Login failed. Please try again."));
        }
      }, 800); // Simulate network delay
    });
  };
  
  const signup = async (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        try {
          const users = getUserDatabase();
          
          // Check if username already exists
          if (users.some((u) => u.username === username)) {
            reject(new Error("Username already exists"));
            return;
          }
          
          // Create new user
          const newUser: UserCredentials = {
            username,
            password,
          };
          
          // Add to "database"
          users.push(newUser);
          localStorage.setItem("users", JSON.stringify(users));
          
          // Login the new user
          const userData: User = {
            id: uuidv4(),
            username,
          };
          
          setUser(userData);
          localStorage.setItem("currentUser", JSON.stringify(userData));
          resolve();
        } catch (err) {
          reject(new Error("Registration failed. Please try again."));
        }
      }, 800); // Simulate network delay
    });
  };
  
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
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
