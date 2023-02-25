import { combineReducers } from "@reduxjs/toolkit";
// import session from "./sessionSlice";
import projects from "./project.slice";

const reducer = combineReducers({
  projects,
});

export default reducer;
