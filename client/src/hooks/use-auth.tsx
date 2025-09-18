import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { Teacher, Student } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  userType: 'teacher' | 'student';
  // Teacher properties
  email?: string;
  isAdmin?: boolean | null;
  schoolId?: string | null;
  // Student properties
  class?: string;
  rollNumber?: string;
  pin?: string;
  // Common properties
  status: string;
  contactNumber?: string | null;
  createdAt: Date;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  teacherLoginMutation: UseMutationResult<AuthUser, Error, TeacherLoginData>;
  studentLoginMutation: UseMutationResult<AuthUser, Error, StudentLoginData>;
  teacherRegisterMutation: UseMutationResult<AuthUser, Error, TeacherRegisterData>;
  studentRegisterMutation: UseMutationResult<AuthUser, Error, StudentRegisterData>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

type TeacherLoginData = { email: string; password: string };
type StudentLoginData = { identifier: string; pin: string };
type TeacherRegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  schoolId: string;
  contactNumber?: string;
};
type StudentRegisterData = {
  firstName: string;
  lastName: string;
  rollNumber: string;
  class: string;
  schoolId: string;
  contactNumber?: string;
  pin: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<AuthUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const teacherLoginMutation = useMutation({
    mutationFn: async (credentials: TeacherLoginData) => {
      const res = await apiRequest("POST", "/api/login/teacher", credentials);
      return await res.json();
    },
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: `Logged in successfully as ${user.firstName} ${user.lastName}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const studentLoginMutation = useMutation({
    mutationFn: async (credentials: StudentLoginData) => {
      const res = await apiRequest("POST", "/api/login/student", credentials);
      return await res.json();
    },
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome!",
        description: `Logged in successfully as ${user.firstName} ${user.lastName}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const teacherRegisterMutation = useMutation({
    mutationFn: async (data: TeacherRegisterData) => {
      const res = await apiRequest("POST", "/api/register/teacher", data);
      return await res.json();
    },
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: "Welcome to Nabha Learning Platform!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const studentRegisterMutation = useMutation({
    mutationFn: async (data: StudentRegisterData) => {
      const res = await apiRequest("POST", "/api/register/student", data);
      return await res.json();
    },
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: "Welcome to Nabha Learning Platform!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "Come back soon!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        teacherLoginMutation,
        studentLoginMutation,
        teacherRegisterMutation,
        studentRegisterMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
