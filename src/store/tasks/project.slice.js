import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  projectlist: [],
  tasklist: {},
  activetab: 'list'
};

export const ProjectsSlice = createSlice({
  name: "auth/projecttask",
  initialState,
  reducers: {
    setprojectList: (state, action) => {
      console.log(action.payload, "payloaddd");
      state.projectlist = action.payload;
    },
    settasklist: (state, action) => {
   state.tasklist = action.payload
    },
    setActiveTab: (state, action) => {
      state.activetab = action.payload
    }
  },
});

export const { setprojectList, settasklist, setActiveTab } = ProjectsSlice.actions;

export default ProjectsSlice.reducer;
