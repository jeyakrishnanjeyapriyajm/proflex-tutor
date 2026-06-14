import { createSlice } from "@reduxjs/toolkit";

const savedAuth = JSON.parse(localStorage.getItem("auth"));

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || null,
  isAuthenticated: !!savedAuth?.token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        })
      );
    },

    updateUser: (state, action) => {
      state.user = action.payload;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload,
          token: state.token,
        })
      );
    },

    logout: (state) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;

  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userToken");
},
  },
});

export const { loginSuccess, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;