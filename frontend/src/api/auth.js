import axios from "axios";

const API = "http://localhost:3000/api";

export const registerUser = (data) => {
    return axios.post(`${API}/auth/register`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        withCredentials: true
    });
};

export const loginUser = (data) => {
    return axios.post(`${API}/auth/login`, data, {
        withCredentials: true
    });
};

export const logoutUser = () => {
  return axios.post(`${API}/auth/logout`, {}, {
    withCredentials: true
  });
};

export const getProfile = () => {
  return axios.get(`${API}/auth/profile`, {
    withCredentials: true
  });
};

export const updateProfile = (data) => {
  return axios.put(`${API}/users/update`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    withCredentials: true
  });
};
