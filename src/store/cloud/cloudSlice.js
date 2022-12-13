import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  dropboxfiles: [],
  onedriveFiles: [],
  outlookevents: [],
  outlookmail: [],
  teamsmeeting: [],
};

export const CloudSlice = createSlice({
  name: "auth/teanantuser",
  initialState,
  reducers: {
    setDropboxList: (state, action) => {
      console.log(action.payload, "payloaddd");
      state.dropboxfiles = action.payload;
    },
    setOneDriveFiles: (state, action) => {
      state.onedriveFiles = action.payload;
    },
    setoutlookEvents: (state, action) => {
      state.outlookevents = action.payload;
    },
    setoutlookmails: (state, action) => {
      state.outlookmail = action.payload;
    },
    setteamsmeetings: (state, action) => {
      state.teamsmeeting = action.payload;
    },
  },
});

export const {
  setDropboxList,
  setOneDriveFiles,
  setoutlookmails,
  setoutlookEvents,
  setteamsmeetings,
} = CloudSlice.actions;

export default CloudSlice.reducer;
