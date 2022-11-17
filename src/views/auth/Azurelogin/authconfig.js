export const msalConfig = {
  auth: {
    clientId: "2fecf9a4-b742-4a48-93c1-7905cc13aa13",
    clientSecret: "9c4ed369-eb08-4e92-b0f5-e3e171766367",
    authority: "https://login.microsoftonline.com/common/",
    redirectUri: `https://${window.location.hostname}`,
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

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me",
};
