import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apigetprofile,
  apiuserprofileupdate,
  apiuserpasswordupdate,
} from "services/AuthService";

export const initialState = {
  avatar: "",
  userName: "",
  email: "",
  authority: [],
  userProfile: "",
  error: "",
  updateProfile: "",
  updateerror: "",
};
export const GetProfile = createAsyncThunk(
  "user/getprofile",
  async (data, { getState, dispatch }) => {
    try {
      const response = await apigetprofile(data);
      return response.data;
    } catch (e) {
      return e.response;
    }
  }
);
export const UpdateProfile = createAsyncThunk(
  "user/updateprofile",
  async (data, { getState, dispatch }) => {
    try {
      const response = await apiuserprofileupdate(data);
      return response.data;
    } catch (e) {
      return e.response;
    }
  }
);
export const UpdateProfilePassword = createAsyncThunk(
  "user/updateprofilepassword",
  async (data, { getState, dispatch }) => {
    try {
      const response = await apiuserpasswordupdate(data);
      return response.data;
    } catch (e) {
      return e.response;
    }
  }
);
export const userSlice = createSlice({
  name: "auth/user",
  initialState,
  reducers: {
    setUser: (_, action) => action.payload,
    userLoggedOut: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(GetProfile.fulfilled, (state, action) => {
      state.userProfile = JSON.parse(action.payload.message)[0];
    });
    builder.addCase(GetProfile.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(UpdateProfile.fulfilled, (state, action) => {
      state.updateProfile = action.payload;
    });
    builder.addCase(UpdateProfile.rejected, (state, action) => {
      state.updateerror = action.payload;
    });
    builder.addCase(UpdateProfilePassword.fulfilled, (state, action) => {
      state.updateProfile = action.payload;
    });
    builder.addCase(UpdateProfilePassword.rejected, (state, action) => {
      state.updateerror = action.payload;
    });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
