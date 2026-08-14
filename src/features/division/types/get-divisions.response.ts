import type { BasePaginationResponse } from "@/shared/types/base-response";

export type DivisionItem = {
  id: number;
  name: string;
  note: string;
};

export type GetDivisionsResponse = BasePaginationResponse<DivisionItem>;
