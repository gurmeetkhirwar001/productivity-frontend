import {
  Zoom,
  Zoomtoken,
  ZoomMeetings,
  Slack,
  SlackToken,
  Clickup,
  ClickupToken,
} from "services/CollaborationService";
import { setZoommeetings } from "store/colaborations/colaborationsSlice";
import { useDispatch } from "react-redux";

function useColaboration() {
  const dispatch = useDispatch();
  const GetZoomConnect = async (body) => {
    const data = await Zoom(body);
    return data;
  };
  const GetCliCkupConnect = async (body) => {
    const data = await Clickup(body);
    return data;
  };
  const GetSlackConnect = async () => {
    const data = await Slack();
    return data;
  };
  const GetZoomToken = async (body) => {
    const data = await Zoomtoken(body);
    return data;
  };
  const GetSlackToken = async (body) => {
    const data = await SlackToken(body);
    return data;
  };
  const GetclickupToken = async (body) => {
    const data = await ClickupToken(body);
    return data;
  };
  const GetZoomMeetings = async (body) => {
    const data = await ZoomMeetings(body);
    dispatch(setZoommeetings(data?.data?.message?.meetings));
    return data;
  };
  return {
    GetZoomConnect,
    GetZoomToken,
    GetZoomMeetings,
    GetSlackConnect,
    GetSlackToken,
    GetCliCkupConnect,
    GetclickupToken,
  };
}

export default useColaboration;
