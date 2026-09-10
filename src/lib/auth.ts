const KEY = "madar_role";

export type Role = "admin" | "employee" | "guest";

export function getRole(): Role {
  if (typeof window === "undefined") return "guest";
  const role = window.localStorage.getItem(KEY) as Role | null;
  return role === "admin" || role === "employee" || role === "guest" ? role : "guest";
}

export function setRole(r: Role) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, r);
  window.dispatchEvent(new Event("madar-role-change"));
}

export function isEmployee() {
  const role = getRole();
  return role === "employee" || role === "admin";
}
