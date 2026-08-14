import type { BasePaginationResponse } from "@/shared/types/base-response";

export type DepartmentItem = {
  id: number;
  name: string;
  note: string;
};

export type GetDepartmentsResponse = BasePaginationResponse<DepartmentItem>;
