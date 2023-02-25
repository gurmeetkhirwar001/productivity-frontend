import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
 tasklist: {},
};

export const TaskSlice = createSlice({
  name: "auth/projecttask",
  initialState,
  reducers: {
    
    settasklist: (state, action) => {
      state.tasklist = action.payload;
    },
  },
});

export const {  settasklist } = TaskSlice.actions;

export default TaskSlice.reducer;
