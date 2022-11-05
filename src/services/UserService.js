import BaseService from "./BaseService";

export const ListTenantUser = async (body) => {
  return await BaseService.post("/users/list-user-tenant", body);
};
export const InviteUser = async (body) => {
  return await BaseService.post("/users/invite-user", body);
};
