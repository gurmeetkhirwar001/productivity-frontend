import { useSelector, useDispatch } from "react-redux";
import { setUser, initialState } from "store/auth/userSlice";
import {
  apiSignIn,
  apiSignOut,
  apiSignUp,
  apiValidateUser,
} from "services/AuthService";
import { onSignInSuccess, onSignOutSuccess } from "store/auth/sessionSlice";
import appConfig from "configs/app.config";
import { REDIRECT_URL_KEY } from "constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import { ADMIN } from "constants/roles.constant";

function useAuth() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const query = useQuery();

  const { token, signedIn } = useSelector((state) => state.auth.session);

  const signIn = async (data) => {
    try {
      const resp = await apiSignIn(data);
      if (resp.data) {
        const { app_token: token } = resp.data.message.token;
        console.log(token);
        dispatch(onSignInSuccess(token));
        const { loginId: email, ...restUser } = JSON.parse(
          resp.data.message.user
        )[0];
        if (resp.data.message.user) {
          dispatch(
            setUser(
              { email, authority: [ADMIN], ...restUser } || {
                avatar: "",
                userName: "Anonymous",
                authority: ["USER"],
                email: "",
              }
            )
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };
  const signUp = async (data) => {
    try {
      const validateUserResponse = await apiValidateUser(data);
      
      const resp = await apiSignUp(data);
      navigate("/sign-in");
      return {
        status: "success",
        message: "User Register SuccessFully. Please Login",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(onSignOutSuccess());
    dispatch(setUser(initialState));
    navigate(appConfig.unAuthenticatedEntryPath);
  };
  // const
  const signOut = async () => {
    try {
      await apiSignOut();
      handleSignOut();
    } catch (errors) {
      handleSignOut();
    }
  };

  return {
    authenticated: token && signedIn,
    signIn,
    signOut,
  };
}

export default useAuth;
