import { Router } from "react-router-dom";
import * as Cryptojs from "crypto-js";
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

const d = new Date();
let diff = d.getTimezoneOffset();
export const DefaultBody = {
  urllink: window.location.pathname,
  netip: "1232132231",
  webapp: fnBrowserDetect(),
  gps: "[{‘latitude’: ‘19.0759899’, ‘longitude’: ‘72.8773928’}]",
  timezone: diff,
};
export function encryptMessage(data) {
  const jsEncrypt = Cryptojs.AES.encrypt(
    JSON.stringify(data),
    "secret key 123"
  ).toString();

  return jsEncrypt;
}
