export const ACCESS_TOKEN_KEY = "admin-portal.access-token";
export const STAFF_ID_KEY = "admin-portal.staff-id";
export const STAFF_NAME_KEY = "admin-portal.staff-name";
export const STAFF_ROLE_KEY = "admin-portal.staff-role";

export type UserRole = "ROLE_ADMIN" | "ROLE_SUPERADMIN" | "ROLE_STAFF";

export function normalizeRole(role: unknown): UserRole {
  const value = Array.isArray(role) ? role[0] : role;
  if (value === "ROLE_ADMIN" || value === "ROLE_SUPERADMIN") {
    return value;
  }
  return "ROLE_STAFF";
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function setCurrentStaff(
  staffId: number | string,
  staffName: string,
  role?: unknown,
) {
  localStorage.setItem(STAFF_ID_KEY, String(staffId));
  localStorage.setItem(STAFF_NAME_KEY, staffName);
  localStorage.setItem(STAFF_ROLE_KEY, normalizeRole(role));
}

export function getCurrentStaff() {
  const id = localStorage.getItem(STAFF_ID_KEY);
  const name = localStorage.getItem(STAFF_NAME_KEY);
  const role = localStorage.getItem(STAFF_ROLE_KEY);

  return {
    id: id !== null && id !== "" ? Number(id) : 1,
    name: name || "Quản trị viên",
    role: normalizeRole(role),
  };
}

export function getCurrentRole(): UserRole {
  return normalizeRole(localStorage.getItem(STAFF_ROLE_KEY));
}

export function clearCurrentStaff() {
  localStorage.removeItem(STAFF_ID_KEY);
  localStorage.removeItem(STAFF_NAME_KEY);
  localStorage.removeItem(STAFF_ROLE_KEY);
}

export function clearAllClientStorage() {
  localStorage.clear();
  sessionStorage.clear();
}
