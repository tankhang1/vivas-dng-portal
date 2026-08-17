export type DepartmentStatus = "active" | "inactive";

export type DepartmentRecord = {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  description: string;
  order: number;
  manager: string;
  managerId: number | null;
  status: DepartmentStatus;
};
