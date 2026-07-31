import { createSlice } from "@reduxjs/toolkit";

const storedUser = (() => {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
})();

const storedToken = localStorage.getItem("accessToken") || null;

const initialState = {
    user: storedUser,          
    accessToken: storedToken,  
    isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Called on successful login or email verification (auto-login)
        setCredentials(state, action) {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken ?? state.accessToken;
            state.isAuthenticated = true;

            // Persist to localStorage for page-refresh rehydration
            localStorage.setItem("user", JSON.stringify(user));
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
            }
        },

        // Called after a token refresh (new accessToken only)
        updateAccessToken(state, action) {
            state.accessToken = action.payload;
            localStorage.setItem("accessToken", action.payload);
        },

        // Called on logout
        clearCredentials(state) {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            // Remove old key if it was ever set
            localStorage.removeItem("token");
        },
    },
});

export const { setCredentials, updateAccessToken, clearCredentials } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
