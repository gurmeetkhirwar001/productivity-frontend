import { combineReducers } from "@reduxjs/toolkit";
// import session from "./sessionSlice";
import teanantUser from "./user.slice";

const reducer = combineReducers({
  teanantUser,
});

export default reducer;
