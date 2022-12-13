import { combineReducers } from 'redux'
import theme from './theme/themeSlice'
import auth from './auth'
import base from './base'
import user from "./user";
import cloud from "./cloud";

const rootReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    theme,
    auth,
    base,
    user,
    cloud,
    ...asyncReducers,
  });
  return combinedReducer(state, action);
};
  
export default rootReducer
