import axios from "axios";
import appConfig from "configs/app.config";
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from "constants/api.constant";
import { PERSIST_STORE_NAME } from "constants/app.constant";
import deepParseJson from "utils/deepParseJson";
import store from "../store";
import { onSignOutSuccess } from "../store/auth/sessionSlice";

const unauthorizedCode = [401];

const BaseService = axios.create({
  timeout: 60000,
  baseURL: "http://localhost:4000",
});

BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
    const persistData = deepParseJson(rawPersistData);

    const accessToken = persistData.auth.session.token;
    const apptoken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiQXBwLXRva2VuIiwiaWF0IjoxNjY1MjE2MzE1fQ.Gw-4o7gRwxkY_l7crZgy3tmYW2fGY74eBslVfNUdMis";
    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`;
    }
    if (apptoken) {
      config.headers["token"] = apptoken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BaseService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && unauthorizedCode.includes(response.status)) {
      store.dispatch(onSignOutSuccess());
    }

    return Promise.reject(error);
  }
);

export default BaseService;
