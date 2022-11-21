import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
  name: "auth/session",
  initialState: {
    token: "",
    signedIn: false,
    apptoken: "",
  },
  reducers: {
    onSignInSuccess: (state, action) => {
      state.signedIn = true;
      state.token = action.payload;
    },
    onSignOutSuccess: (state) => {
      state.signedIn = false;
      state.token = "";
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAppToken: (state, action) => {
      state.apptoken = action.payload;
    },
  },
});

export const { onSignInSuccess, onSignOutSuccess, setToken, setAppToken } =
  sessionSlice.actions;

export default sessionSlice.reducer