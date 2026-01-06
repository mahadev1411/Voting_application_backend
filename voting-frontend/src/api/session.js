export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
};

export const getToken = () => localStorage.getItem("token");
