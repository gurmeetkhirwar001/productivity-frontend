import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  tenantUserList: [],
  invitedUser: {},
};

export const teanantUserSlice = createSlice({
  name: "auth/teanantuser",
  initialState,
  reducers: {
    setTeanantList: (state, action) => {
      console.log(action.payload, "payloaddd");
      state.tenantUserList = action.payload;
    },
    setInviteuser: (state, action) => {
      state.invitedUser = action.payload;
    },
  },
});

export const { setTeanantList, setInviteuser } = teanantUserSlice.actions;

export default teanantUserSlice.reducer;
