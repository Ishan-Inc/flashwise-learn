
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

// Types
interface User {
  id: string;
  username: string;
  // Added profile picture for Google users
  profilePicture?: string;
}

interface UserCredentials {
  username: string;
  password: string;
  // Optional for Google login
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (data: { username?: string; profilePicture?: string }) => Promise<void>;
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
              profilePicture: user.profilePicture,
            };
            
            setUser(userData);
            localStorage.setItem("currentUser", JSON.stringify(userData));
            
            toast({
              title: "Logged In",
              description: `Welcome back, ${userData.username}!`,
            });
            
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
  
  const loginWithGoogle = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate Google login API call
      setTimeout(() => {
        try {
          // Generate a random Google user
          const googleUser = {
            id: uuidv4(),
            username: `user${Math.floor(Math.random() * 10000)}@gmail.com`,
            profilePicture: "https://ui-avatars.com/api/?background=0D8ABC&color=fff",
          };
          
          // Add to users database if not exists
          const users = getUserDatabase();
          if (!users.some(u => u.username === googleUser.username)) {
            users.push({
              username: googleUser.username,
              password: uuidv4(), // Random password as we won't use it
              profilePicture: googleUser.profilePicture,
            });
            localStorage.setItem("users", JSON.stringify(users));
          }
          
          setUser(googleUser);
          localStorage.setItem("currentUser", JSON.stringify(googleUser));
          
          toast({
            title: "Logged In with Google",
            description: `Welcome, ${googleUser.username}!`,
          });
          
          resolve();
        } catch (err) {
          reject(new Error("Google login failed. Please try again."));
        }
      }, 1000); // Simulate network delay
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
            profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
          };
          
          // Add to "database"
          users.push(newUser);
          localStorage.setItem("users", JSON.stringify(users));
          
          // Login the new user
          const userData: User = {
            id: uuidv4(),
            username,
            profilePicture: newUser.profilePicture,
          };
          
          setUser(userData);
          localStorage.setItem("currentUser", JSON.stringify(userData));
          
          toast({
            title: "Account Created",
            description: "Your account has been successfully created.",
          });
          
          resolve();
        } catch (err) {
          reject(new Error("Registration failed. Please try again."));
        }
      }, 800); // Simulate network delay
    });
  };
  
  const updateProfile = async (data: { username?: string; profilePicture?: string }): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!user) {
            reject(new Error("No user logged in"));
            return;
          }
          
          const updatedUser = {
            ...user,
            ...data,
          };
          
          // Update user in "database"
          const users = getUserDatabase();
          const userIndex = users.findIndex(u => u.username === user.username);
          
          if (userIndex >= 0 && data.username) {
            users[userIndex].username = data.username;
            if (data.profilePicture) {
              users[userIndex].profilePicture = data.profilePicture;
            }
            localStorage.setItem("users", JSON.stringify(users));
          }
          
          // Update current user
          setUser(updatedUser);
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
          });
          
          resolve();
        } catch (err) {
          reject(new Error("Failed to update profile. Please try again."));
        }
      }, 500);
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
    loginWithGoogle,
    signup,
    logout,
    isAuthenticated: !!user,
    updateProfile,
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
