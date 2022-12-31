import { Zoom, Zoomtoken, ZoomMeetings } from "services/CollaborationService";
import { setZoommeetings } from "store/colaborations/colaborationsSlice";
import { useDispatch } from "react-redux";

function useColaboration() {
  const dispatch = useDispatch();
  const GetZoomConnect = async (body) => {
    const data = await Zoom(body);
    return data;
  };
  const GetZoomToken = async (body) => {
    const data = await Zoomtoken(body);
    return data;
  };
  const GetZoomMeetings = async (body) => {
    const data = await ZoomMeetings(body);
    dispatch(setZoommeetings(data?.data?.message?.meetings));
    return data;
  };
  return { GetZoomConnect, GetZoomToken, GetZoomMeetings };
}

export default useColaboration;
