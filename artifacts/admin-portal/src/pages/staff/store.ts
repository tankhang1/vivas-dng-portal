import { mockStaff } from '../../data/mock';
import { defaultStaff, normalizeStaff, type StaffRecord } from './types';

let staffState: StaffRecord[] = mockStaff.map((item) => normalizeStaff(item));

export function getStaff() {
  return [...staffState];
}

export function getStaffById(id: string) {
  return staffState.find((item) => item.id === id) ?? null;
}

function buildUsername(staff: StaffRecord) {
  if (staff.username) return staff.username;
  const base = staff.phone || staff.name;
  return base
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .slice(0, 32) || `staff-${Date.now()}`;
}

export function saveStaff(staff: StaffRecord) {
  const nextStaff = normalizeStaff({
    ...defaultStaff(),
    ...staff,
    id: staff.id || Date.now().toString(),
    username: buildUsername(staff),
  });

  const exists = staffState.some((item) => item.id === nextStaff.id);
  staffState = exists
    ? staffState.map((item) => (item.id === nextStaff.id ? nextStaff : item))
    : [nextStaff, ...staffState];
}

export function deleteStaff(id: string) {
  staffState = staffState.filter((item) => item.id !== id);
}
