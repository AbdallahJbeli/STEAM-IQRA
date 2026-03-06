const API_BASE_URL = "http://localhost:4001/api/auth";

// Helper pour les headers avec token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Inscription
export const register = async (email, password, role) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || "Échec de l'inscription");
  }
  return data;
};

// Connexion
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || "Échec de la connexion");
  }
  return data; // { token }
};

// Récupérer le profil utilisateur connecté
export const getMe = async () => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Non autorisé");
  }
  return data; // { id, email, role, is_active, created_at }
};

// Récupérer le profil protégé
export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Non autorisé");
  }
  return data;
};
