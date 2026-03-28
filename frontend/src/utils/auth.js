export const getRole = () => localStorage.getItem("role");
export const isLoggedIn = () => !!localStorage.getItem("token");
