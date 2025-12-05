import { create } from "zustand";
import { api } from "../lib/axios";
import { AxiosError } from "axios";

interface User {
    _id: string;
    email: string;
    name: string;
    isVerified: boolean;
    createdAt: string;
	lastLogin: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    message: string | null; 

    signup: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (code: string) => Promise<void>;
    checkAuth: () => Promise<void>;

    // NEW FUNCTIONS
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/signup", { email, password, name });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            set({ error: axiosError.response?.data?.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/login", { email, password });
            set({ user: response.data.user, isAuthenticated: true, error: null, isLoading: false });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            set({ error: axiosError.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/auth/logout");
            set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/verifyEmail", { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            set({ error: axiosError.response?.data?.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await api.get("/auth/check-auth");
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },


    forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/forgotPassword", { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: (error as AxiosError<{ message: string }>).response?.data?.message || "Error sending reset email",
            });
            throw error;
        }
    },

    resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(`/auth/resetPassword/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: (error as AxiosError<{ message: string }>).response?.data?.message || "Error resetting password",
            });
            throw error;
        }
    },
}));