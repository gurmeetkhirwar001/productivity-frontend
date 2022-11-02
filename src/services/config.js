import axios from "axios";

export const AxiosBaseUrl = axios.create({
  baseURL: "http://localhost:3000/",
});
