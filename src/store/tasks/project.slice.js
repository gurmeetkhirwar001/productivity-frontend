import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateNewProject ,GetprojectTypeList} from "services/projecttaskservices";

export const initialState = {
  projectlist: [],
  tasklist: {},
  activetab: 'list',
  newProject: '',
  newprojecterror:'',
  selectedTask:{},
  editModal: false,
  createModal: false
};
export const CreateProject = createAsyncThunk('task/projectcreate',async (data,{getState, dispatch}) => {
  try{
    const response = await CreateNewProject(data)

    return response.data
  }catch(e){
    return e.response
  }
})
export const getProjectTypeList = createAsyncThunk('task/projecttypelist',async (data,{getState, dispatch}) => {
  try{
    const response = await GetprojectTypeList(data)

    return response.data
  }catch(e){
    return e.response
  }
})
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
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload
    },
    setEditModal: (state, action) => {
      state.editModal = action.payload
    },
    setCreateModal: (state, action) => {
      state.createModal = action.payload
    }
  },
  extraReducers:(builder) =>{
    builder.addCase(CreateProject.fulfilled,(state, action) => {
      state.newProject = action.payload
    })
    builder.addCase(CreateProject.rejected, (state, action) => {
      state.newprojecterror = action.payload
    })
    builder.addCase(getProjectTypeList.fulfilled,(state, action) => {
      state.newProject = action.payload
    })
    builder.addCase(getProjectTypeList.rejected, (state, action) => {
      state.newprojecterror = action.payload
    })
    
  }
});

export const { setprojectList, settasklist, setActiveTab,setSelectedTask, setEditModal, setCreateModal } = ProjectsSlice.actions;

export default ProjectsSlice.reducer;
