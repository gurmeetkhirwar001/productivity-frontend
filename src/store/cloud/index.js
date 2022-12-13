import { combineReducers } from "@reduxjs/toolkit";
// import session from "./sessionSlice";
import CloudSlice from "./cloudSlice";

const reducer = combineReducers({
  CloudSlice,
});

export default reducer;
