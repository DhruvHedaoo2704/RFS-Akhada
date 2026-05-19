const AUTH_STORAGE_KEY = "rfs-authenticated";

export function isAuthenticated() {
  return typeof window !== "undefined" && window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function login() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
