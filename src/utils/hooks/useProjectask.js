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
import { CCloneProject, CreateProject,CUpdateProject } from "store/tasks/project.slice";
function useProjectTask() {
  const dispatch = useDispatch();
  const createProjectaction = async (data) => {
    const responsedata = await dispatch(CreateProject(data));

    return responsedata;
  };

  const UpdateProjectaction = async (data) => {
    const responsedata = await dispatch(CUpdateProject(data));

    return responsedata;
  };
  const CloneProjectaction = async (data) => {
    const responsedata = await dispatch(CCloneProject(data));

    return responsedata;
  };
  return {
    createProjectaction,
    UpdateProjectaction,
    CloneProjectaction
  };
}

export default useProjectTask;
