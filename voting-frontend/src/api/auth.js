import api from "./axios";

export const registerUser = (payload) => api.post("/user/signup", payload);
export const loginUser = (payload) => api.post("/user/login", payload);
export const getProfile = () => api.get("/user/profile");
export const changePassword = (payload) => api.put("/user/profile/password", payload);
