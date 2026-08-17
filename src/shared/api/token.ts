export const ACCESS_TOKEN_KEY = "admin-portal.access-token";
export const STAFF_ID_KEY = "admin-portal.staff-id";
export const STAFF_NAME_KEY = "admin-portal.staff-name";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function setCurrentStaff(staffId: number | string, staffName: string) {
  localStorage.setItem(STAFF_ID_KEY, String(staffId));
  localStorage.setItem(STAFF_NAME_KEY, staffName);
}

export function getCurrentStaff() {
  const id = localStorage.getItem(STAFF_ID_KEY);
  const name = localStorage.getItem(STAFF_NAME_KEY);

  return {
    id: id && id !== "" ? Number(id) || 1 : 1,
    name: name || "Quản trị viên",
  };
}

export function clearCurrentStaff() {
  localStorage.removeItem(STAFF_ID_KEY);
  localStorage.removeItem(STAFF_NAME_KEY);
}
