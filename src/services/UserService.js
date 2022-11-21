import BaseService from "./BaseService";

const AuthTOken = localStorage.getItem("authtoken")
  ? localStorage?.getItem("authtoken")
  : localStorage?.getItem("apptoken");
console.log(AuthTOken);
export const ListTenantUser = async (body) => {
  return await BaseService.post("/users/list-user-tenant", body, {
    headers: {
      token: AuthTOken,
    },
  });
};
export const InviteUser = async (body) => {
  return await BaseService.post("/users/invite-user", body, {
    headers: {
      token: AuthTOken,
    },
  });
};
