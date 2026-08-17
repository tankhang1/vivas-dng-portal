import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDepartmentProcess,
  getDepartmentById,
  getDepartments,
  getDepartmentSubs,
  editDepartmentProcess,
  removeDepartmentProcess,
} from "@/features/department/api/department.api";
import type { CreateDepartmentProcessRequest } from "@/features/department/types/create-department-process.request";
import type { CreateDepartmentProcessResponse } from "@/features/department/types/create-department-process.response";
import type { GetDepartmentResponse } from "@/features/department/types/get-department.response";
import type { GetDepartmentsResponse } from "@/features/department/types/get-departments.response";
import type { EditDepartmentProcessRequest } from "@/features/department/types/edit-department-process.request";
import type { RemoveDepartmentProcessRequest } from "@/features/department/types/remove-department-process.request";
import { QUERY_KEY } from "@/shared/api";

export function useCreateDepartmentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateDepartmentProcessResponse,
    Error,
    CreateDepartmentProcessRequest
  >({
    mutationFn: createDepartmentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.DEPARTMENTS });
    },
  });
}

export function useEditDepartmentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateDepartmentProcessResponse,
    Error,
    EditDepartmentProcessRequest
  >({
    mutationFn: editDepartmentProcess,
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.DEPARTMENTS }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.DEPARTMENT(variables.id),
        }),
      ]);
    },
  });
}

export function useRemoveDepartmentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateDepartmentProcessResponse,
    Error,
    RemoveDepartmentProcessRequest
  >({
    mutationFn: removeDepartmentProcess,
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.DEPARTMENTS }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.DEPARTMENT(variables.item),
        }),
      ]);
    },
  });
}

export function useDepartmentsQuery() {
  return useQuery<GetDepartmentsResponse>({
    queryKey: QUERY_KEY.DEPARTMENTS,
    queryFn: getDepartments,
  });
}

export function useDepartmentSubsQuery(idRoot?: number | string) {
  return useQuery<GetDepartmentsResponse>({
    queryKey:
      idRoot === undefined || idRoot === null || idRoot === ""
        ? QUERY_KEY.DEPARTMENTS_SUB("")
        : QUERY_KEY.DEPARTMENTS_SUB(idRoot),
    queryFn: () => getDepartmentSubs(idRoot as number | string),
    enabled: idRoot !== undefined && idRoot !== null && idRoot !== "",
  });
}

export function useDepartmentQuery(id?: number | string) {
  return useQuery<GetDepartmentResponse>({
    queryKey:
      id === undefined || id === null || id === ""
        ? QUERY_KEY.DEPARTMENT("")
        : QUERY_KEY.DEPARTMENT(id),
    queryFn: () => getDepartmentById(id as number | string),
    enabled: id !== undefined && id !== null && id !== "",
  });
}
