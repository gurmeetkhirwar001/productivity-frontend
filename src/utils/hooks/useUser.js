/* eslint-disable no-unreachable */
import { useSelector, useDispatch } from "react-redux";
import { setUser, initialState } from "store/auth/userSlice";
import { ListTenantUser, InviteUser } from "services/UserService";
import { setInviteuser, setTeanantList } from "store/user/user.slice";
import appConfig from "configs/app.config";
import { REDIRECT_URL_KEY } from "constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";

function useTeanant() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const ListUserTeanants = async (data) => {
    try {
      const resp = await ListTenantUser(data);
      dispatch(setTeanantList(JSON.parse(resp?.data?.message?.responce)));
      return {
        status: "success",
        message: "",
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };
  const InviteUsers = async (data) => {
    try {
      const resp = await InviteUser(data);
      dispatch(setInviteuser(resp?.data?.message));
      return {
        status: "success",
        message: resp?.data?.message,
      };
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  return {
    ListUserTeanants,
    InviteUsers,
  };
}

export default useTeanant;
