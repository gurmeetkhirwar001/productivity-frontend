import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CloneProject, CreateNewProject ,GetprojectTypeList, UpdateProject} from "services/projecttaskservices";

export const initialState = {
  projectlist: [],
  tasklist: {},
  activetab: 'list',
  newProject: '',
  newprojecterror:'',
  selectedTask:{},
  editModal: false,
  createModal: false,
  cloneModal: false,
  selectedProject:{}
};



export const CreateProject = createAsyncThunk('task/projectcreate',async (data,{getState, dispatch}) => {
  try{
    const response = await CreateNewProject(data)

    return response.data
  }catch(e){
    return e.response
  }
})
export const CUpdateProject = createAsyncThunk('task/updatecreate',async (data,{getState, dispatch}) => {
  try{
    const response = await UpdateProject(data)

    return response.data
  }catch(e){
    return e.response
  }
})
export const CCloneProject = createAsyncThunk('task/clone',async (data,{getState, dispatch}) => {
  try{
    const response = await CloneProject(data)

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
    },
    setCloneModal: (state, action) => {
      state.cloneModal = action.payload
    },
    setEditProjectModal: (state, action) => {
      state.selectedProject = action.payload
    }
  },
  extraReducers:(builder) =>{
    builder.addCase(CreateProject.fulfilled,(state, action) => {
      state.newProject = action.payload
    })
    builder.addCase(CreateProject.rejected, (state, action) => {
      state.newprojecterror = action.payload
    })
    builder.addCase(CUpdateProject.fulfilled,(state, action) => {
      state.newProject = action.payload
    })
    builder.addCase(CUpdateProject.rejected, (state, action) => {
      state.newprojecterror = action.payload
    })
    builder.addCase(CCloneProject.fulfilled,(state, action) => {
      state.newProject = action.payload
    })
    builder.addCase(CCloneProject.rejected, (state, action) => {
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

export const { setprojectList, settasklist, setActiveTab,setSelectedTask, setEditModal, setCreateModal,setEditProjectModal,setCloneModal } = ProjectsSlice.actions;

export default ProjectsSlice.reducer;
