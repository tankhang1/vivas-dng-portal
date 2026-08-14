import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createDepartmentProcess,
  getDepartmentById,
  getDepartments,
  editDepartmentProcess,
  removeDepartmentProcess,
} from '@/features/department/api/department.api';
import type { CreateDepartmentProcessRequest } from '@/features/department/types/create-department-process.request';
import type { CreateDepartmentProcessResponse } from '@/features/department/types/create-department-process.response';
import type { GetDepartmentResponse } from '@/features/department/types/get-department.response';
import type { GetDepartmentsResponse } from '@/features/department/types/get-departments.response';
import type { EditDepartmentProcessRequest } from '@/features/department/types/edit-department-process.request';
import type { RemoveDepartmentProcessRequest } from '@/features/department/types/remove-department-process.request';
import { QUERY_KEY } from '@/shared/api';

export function useCreateDepartmentProcessMutation() {
  return useMutation<
    CreateDepartmentProcessResponse,
    Error,
    CreateDepartmentProcessRequest
  >({
    mutationFn: createDepartmentProcess,
  });
}

export function useEditDepartmentProcessMutation() {
  return useMutation<
    CreateDepartmentProcessResponse,
    Error,
    EditDepartmentProcessRequest
  >({
    mutationFn: editDepartmentProcess,
  });
}

export function useRemoveDepartmentProcessMutation() {
  return useMutation<
    CreateDepartmentProcessResponse,
    Error,
    RemoveDepartmentProcessRequest
  >({
    mutationFn: removeDepartmentProcess,
  });
}

export function useDepartmentsQuery() {
  return useQuery<GetDepartmentsResponse>({
    queryKey: QUERY_KEY.DEPARTMENTS,
    queryFn: getDepartments,
  });
}

export function useDepartmentQuery(id?: number | string) {
  return useQuery<GetDepartmentResponse>({
    queryKey: id === undefined || id === null || id === '' ? QUERY_KEY.DEPARTMENT('') : QUERY_KEY.DEPARTMENT(id),
    queryFn: () => getDepartmentById(id as number | string),
    enabled: id !== undefined && id !== null && id !== '',
  });
}
