export const getToken = (): string | null => {
  return localStorage.getItem("adminToken");
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

export const removeToken = (): void => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};