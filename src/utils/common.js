import { Router } from "react-router-dom";
import { publicIpv4 } from "public-ip";
const ip = async () => await publicIpv4();

function fnBrowserDetect() {
  let userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else {
    browserName = "No browser detection";
  }
  return browserName;
}
// const returnIp = async () => {
//   const ip = await publicIpv4();
//   //   console.log(ip);
//   return ip;
// };
// await returnIp();
// const ip2 = async () => await ip();
const d = new Date();
let diff = d.getTimezoneOffset();
// console.log(returnIp());
export const DefaultBody = {
  urllink: window.location.href,
  netip: "1232132231",
  webapp: fnBrowserDetect(),
  gps: "[{'latitude': '19.0759899', 'longitude': '72.8773928'}]",
  timezone: diff,
};
