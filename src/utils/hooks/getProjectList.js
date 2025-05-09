import {
    CloudConnect,
    DropBoxAuthToken,
    DropBoxFiles,
    DropBoxGetUserAccount,
    CalendarConnect,
    UploadDropBoxFiles,
  } from "services/CloudStorageService";
  
  import jwtDecode from "jwt-decode";
  import { encryptMessage } from "utils/common";
  import axios from "axios";
  import { useDispatch } from "react-redux";
  import {
   CreateProject,getProjectTypeList
  } from "store/tasks/project.slice";
  function useProjectTask() {
    const dispatch = useDispatch();
    const createProjectaction = async (data) => {
        const responsedata = await dispatch(CreateProject(data))

        return responsedata
    }
    const getProjectTypeaction = async (data) => {
        const responsedata = await dispatch(getProjectTypeList(data))

        return responsedata
    }
    return {
        createProjectaction,
        getProjectTypeaction
    };
  }
  
  export default useProjectTask;
  