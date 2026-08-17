import { API_PATH, apiClient } from "@/shared/api";
import type { CreateDepartmentProcessRequest } from "@/features/department/types/create-department-process.request";
import type { CreateDepartmentProcessResponse } from "@/features/department/types/create-department-process.response";
import type { GetDepartmentResponse } from "@/features/department/types/get-department.response";
import type { GetDepartmentsResponse } from "@/features/department/types/get-departments.response";
import type { EditDepartmentProcessRequest } from "@/features/department/types/edit-department-process.request";
import type { RemoveDepartmentProcessRequest } from "@/features/department/types/remove-department-process.request";

export async function createDepartmentProcess(
  request: CreateDepartmentProcessRequest,
): Promise<CreateDepartmentProcessResponse> {
  const response = await apiClient.post<CreateDepartmentProcessResponse>(
    API_PATH.DEPARTMENT.CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function editDepartmentProcess(
  request: EditDepartmentProcessRequest,
): Promise<CreateDepartmentProcessResponse> {
  const response = await apiClient.post<CreateDepartmentProcessResponse>(
    API_PATH.DEPARTMENT.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function removeDepartmentProcess(
  request: RemoveDepartmentProcessRequest,
): Promise<CreateDepartmentProcessResponse> {
  const response = await apiClient.post<CreateDepartmentProcessResponse>(
    API_PATH.DEPARTMENT.REMOVE_PROCESS,
    request,
  );

  return response.data;
}

export async function getDepartments(): Promise<GetDepartmentsResponse> {
  // The backend returns a flat, paginated list of every department (root and
  // sub alike, distinguished by department_root_item) rather than roots
  // only, so request a large page to get the whole tree in one call.
  const response = await apiClient.get<GetDepartmentsResponse>(
    `${API_PATH.COMMON.DEPARTMENTS}?sz=200&nu=0`,
  );

  return response.data;
}

export async function getDepartmentSubs(
  idRoot: number | string,
): Promise<GetDepartmentsResponse> {
  const response = await apiClient.get<GetDepartmentsResponse>(
    API_PATH.COMMON.DEPARTMENTS_SUB(idRoot),
  );

  return response.data;
}

export async function getDepartmentById(
  id: number | string,
): Promise<GetDepartmentResponse> {
  const response = await apiClient.get<GetDepartmentResponse>(
    `${API_PATH.COMMON.DEPARTMENT}/${id}`,
  );

  return response.data;
}
