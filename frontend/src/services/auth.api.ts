import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || "http://localhost:4001/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  mustChangeCredentials: boolean;
}

export interface ChangeCredentialsPayload {
  newEmail: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

// api calls
export const authApi = {
  login: (payload: LoginPayload): Promise<LoginResponse> =>
    api.post("/login", payload).then((res) => res.data),

  changeCredentials: (payload: ChangeCredentialsPayload): Promise<void> =>
    api.put("/change-credentials", payload).then((res) => res.data),

  changePassword: (payload: ChangePasswordPayload): Promise<void> =>
    api.put("/change-password", payload).then((res) => res.data),

  getMe: (): Promise<User> =>
    api.get("/me").then((res) => res.data),

  // add to authApi in src/services/auth.api.ts
  createTrainer: (email: string): Promise<{ message: string; credentials: { email: string; tempPassword: string } }> =>
    api.post("/create-trainer", { email }).then((res) => res.data),
};


