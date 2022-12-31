import BaseService from "./BaseService";

export const Zoom = async (body) => {
  const result = await BaseService.post("/collaborations/connectzoom", body);
  return result;
};
export const Zoomtoken = async (body) => {
  const result = await BaseService.post("/collaborations/getzoomtoken", body);
  return result;
};
export const ZoomMeetings = async (body) => {
  const result = await BaseService.post(
    "/collaborations/getzoommeetings",
    body,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("zoomtoken")}`,
      },
    }
  );
  return result;
};
