import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  ZoomMeetings: [],
  onedriveFiles: [],
  outlookevents: [],
  outlookmail: [],
  teamsmeeting: [],
};

export const ColabSlice = createSlice({
  name: "colab",
  initialState,
  reducers: {
    setZoommeetings: (state, action) => {
      console.log(action.payload, "payloaddd");
      state.ZoomMeetings = action.payload;
    },
  },
});

export const { setZoommeetings } = ColabSlice.actions;

export default ColabSlice.reducer;
