import { combineReducers } from "@reduxjs/toolkit";
// import session from "./sessionSlice";
import ColabSlice from "./colaborationsSlice";

const reducer = combineReducers({
  ColabSlice,
});

export default reducer;
