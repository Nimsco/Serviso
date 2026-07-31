import axios from "axios";
import { API_URL } from "./config";

export const registerUser = (data) => {
    return axios.post(`${API_URL}/auth/register`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        withCredentials: true
    });
};

export const loginUser = (data) => {
    return axios.post(`${API_URL}/auth/login`, data, {
        withCredentials: true
    });
};

export const googleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
};

export const verifyEmail = (data) => {
  return axios.post(`${API_URL}/auth/verify-email`, data, {
    withCredentials: true
  });
};

export const logoutUser = () => {
  return axios.post(`${API_URL}/auth/logout`, {}, {
    withCredentials: true
  });
};

export const getProfile = () => {
  return axios.get(`${API_URL}/auth/profile`, {
    withCredentials: true
  });
};

export const updateProfile = (data) => {
  return axios.put(`${API_URL}/users/update`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    withCredentials: true
  });
};

export const refreshAccessToken = () => {
  return axios.post(`${API_URL}/auth/refresh`, {}, {
    withCredentials: true
  });
};
