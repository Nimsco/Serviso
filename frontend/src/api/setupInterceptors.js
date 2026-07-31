import axios from 'axios';
import { refreshAccessToken } from './auth';
import store from '../store/index';
import { clearCredentials, updateAccessToken } from '../store/authSlice';
import { API_URL } from './config';

const setupInterceptors = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Avoid infinite loops if refresh fails
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== `${API_URL}/auth/refresh` &&
        originalRequest.url !== `${API_URL}/auth/login`
      ) {
        originalRequest._retry = true;

        try {
          const res = await refreshAccessToken();
          // The backend sets the new access token in an HttpOnly cookie
          // It also returns it in JSON body (accessToken)
          if (res.data?.accessToken) {
            store.dispatch(updateAccessToken(res.data.accessToken));
          }

          // Retry the original request
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log the user out
          store.dispatch(clearCredentials());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
