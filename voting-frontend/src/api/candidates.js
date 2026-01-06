import api from "./axios";

export const getCandidates = () => api.get("/candidate");
export const voteCandidate = (candidateId) => api.post(`/candidate/vote/${candidateId}`);
export const getResult = () => api.get("/candidate/result");

// admin
export const createCandidate = (payload) => api.post("/candidate/signup", payload);
export const updateCandidate = (id, payload) => api.put(`/candidate/${id}`, payload);
export const deleteCandidate = (id) => api.delete(`/candidate/${id}`);
