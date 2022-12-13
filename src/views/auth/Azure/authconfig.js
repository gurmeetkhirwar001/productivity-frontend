// import {} from "react-router-dom"
const redirectionURI =
  window.location.href ===
    `${window.location.protocol}/${window.location.host}/sign-in` &&
  process.env.REACT_APP_NODE_ENV == "prod"
    ? `${window.location.protocol}/${window.location.host}/`
    : window.location.href ===
        `${window.location.protocol}/${window.location.host}/app/cloudstorage/onedrive` &&
      process.env.REACT_APP_NODE_ENV == "prod"
    ? `${window.location.protocol}/${window.location.host}/app/cloudstorage/onedrive`
    : window.location.href ===
        `${window.location.protocol}/${window.location.host}/app/Calendar/OutlookCalendar` &&
      process.env.REACT_APP_NODE_ENV == "prod"
    ? `${window.location.protocol}/${window.location.host}/app/Calendar/OutlookCalendar`
    : "";
export const msalConfig = {
  auth: {
    clientId: "2fecf9a4-b742-4a48-93c1-7905cc13aa13",
    clientSecret: "9c4ed369-eb08-4e92-b0f5-e3e171766367",
    authority: "https://login.microsoftonline.com/common/",
    redirectUri: redirectionURI,
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"],
};
export const DriveRequest = {
  scopes: ["Files.ReadWrite"],
};
export const CalendarRequest = {
  scopes: ["Calendars.ReadWrite"],
};
export const MailRequest = {
  scopes: ["Mail.ReadWrite"],
};
export const MeetingsRequest = {
  scopes: ["OnlineMeetings.ReadWrite"],
};
// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me",
};
