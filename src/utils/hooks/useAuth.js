import { useSelector, useDispatch } from "react-redux";
import { setUser, initialState } from "store/auth/userSlice";
import {
  apiSignIn,
  apiSignOut,
  apiSignUp,
  apiSocial,
  apiValidateUser,
} from "services/AuthService";
import { onSignInSuccess, onSignOutSuccess } from "store/auth/sessionSlice";
import appConfig from "configs/app.config";
import { REDIRECT_URL_KEY } from "constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import { ADMIN } from "constants/roles.constant";
import jwtDecode from "jwt-decode";
function useAuth() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const query = useQuery();

  const { token, signedIn } = useSelector((state) => state.auth.session);

  const signIn = async (data, type, source) => {
    try {
      if (type === "sso") {
        if (source == "google" || source == "Azure") {
          dispatch(onSignInSuccess(data));
          const {
            email,
            picture: avatar,
            name: userName,
            preferred_username,
            ...restUser
          } = jwtDecode(data);
          const resp = await apiSocial({
            email: source == "Azure" ? preferred_username : email,
            avatar: source == "Azure" ? "" : avatar,
            userName,
            type,
            source,
          });
          if (resp.data.is_success === true) {
            localStorage.setItem("authtoken", data);
            dispatch(onSignInSuccess(data));
            dispatch(
              setUser(
                {
                  email: source == "Azure" ? preferred_username : email,
                  avatar: source == "Azure" ? "" : avatar,
                  userName,
                  authority: [ADMIN],
                  ...restUser,
                } || {
                  avatar: "",
                  userName: "Anonymous",
                  authority: ["USER"],
                  email: "",
                }
              )
            );
            
            const redirectUrl = query.get(REDIRECT_URL_KEY);
            navigate(
              redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
            );
            return {
              status: "success",
              message: "",
            };
          }
        } else {
          const { token, email, avatar, userName } = data;
          dispatch(onSignInSuccess(token));
          localStorage.setItem("authtoken",token)

          const resp = await apiSocial({
            email: email,
            avatar,
            userName,
            type,
            source,
          });
          if (resp.data.is_success === true) {
            dispatch(
              setUser(
                {
                  email,
                  avatar,
                  userName,
                  authority: [ADMIN],
                } || {
                  avatar: "",
                  userName: "Anonymous",
                  authority: ["USER"],
                  email: "",
                }
              )
            );
            const redirectUrl = query.get(REDIRECT_URL_KEY);
            navigate(
              redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
            );
            return {
              status: "success",
              message: "",
            };
          }
        }
      } else {
        const resp = await apiSignIn(data);
        if (resp.data) {
          const { app_token: token } = resp.data.message.token;
          console.log(token);
          dispatch(onSignInSuccess(token));
          localStorage.setItem("authtoken",token)
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
          navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
          );
          return {
            status: "success",
            message: "",
          };
        }
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
