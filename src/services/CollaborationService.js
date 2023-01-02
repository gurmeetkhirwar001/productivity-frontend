import BaseService from "./BaseService";

export const Zoom = async (body) => {
  const result = await BaseService.post("/collaborations/connectzoom", body);
  return result;
};
export const Slack = async () => {
  const result = await BaseService.post("/collaborations/connectslack");
  return result;
};
export const Clickup = async (body) => {
  const result = await BaseService.post("/collaborations/connectclickup", body);
  return result;
};
export const Zoomtoken = async (body) => {
  const result = await BaseService.post("/collaborations/getzoomtoken", body);
  return result;
};
export const SlackToken = async (body) => {
  const result = await BaseService.post("/collaborations/slacktoken", body);
  return result;
};
export const ClickupToken = async (body) => {
  const result = await BaseService.post("/collaborations/clickup", body);
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
