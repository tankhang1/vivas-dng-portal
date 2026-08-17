import { API_PATH, apiClient } from '@/shared/api';
import type { GetStaffsResponse } from '@/features/staff/types/get-staffs.response';
import type { GetStaffDetailResponse } from '@/features/staff/types/get-staff-detail.response';
import type { SearchStaffRequest } from '@/features/staff/types/search-staff.request';
import type { GetStaffByDepartmentRequest } from '@/features/staff/types/get-staff-by-department.request';
import type { GetStaffByDepartmentResponse } from '@/features/staff/types/get-staff-by-department.response';
import type { ActiveStaffCoordinateCommentProcessRequest } from '@/features/staff/types/active-staff-coordinate-comment-process.request';
import type { ActiveStaffCoordinateCommentProcessResponse } from '@/features/staff/types/active-staff-coordinate-comment-process.response';
import type { CreateStaffCoordinateCommentProcessRequest } from '@/features/staff/types/create-staff-coordinate-comment-process.request';
import type { CreateStaffCoordinateCommentProcessResponse } from '@/features/staff/types/create-staff-coordinate-comment-process.response';
import type { DeactiveStaffCoordinateCommentProcessRequest } from '@/features/staff/types/deactive-staff-coordinate-comment-process.request';
import type { DeactiveStaffCoordinateCommentProcessResponse } from '@/features/staff/types/deactive-staff-coordinate-comment-process.response';
import type { EditStaffCoordinateCommentProcessRequest } from '@/features/staff/types/edit-staff-coordinate-comment-process.request';
import type { EditStaffCoordinateCommentProcessResponse } from '@/features/staff/types/edit-staff-coordinate-comment-process.response';
import type { RemoveStaffCoordinateCommentProcessRequest } from '@/features/staff/types/remove-staff-coordinate-comment-process.request';
import type { RemoveStaffCoordinateCommentProcessResponse } from '@/features/staff/types/remove-staff-coordinate-comment-process.response';
import type { GetStaffCoordinateCommentsByCategoryRequest } from '@/features/staff/types/get-staff-coordinate-comments-by-category.request';
import type { GetStaffCoordinateCommentsByCategoryResponse } from '@/features/staff/types/get-staff-coordinate-comments-by-category.response';
import type { GetStaffCoordinateCommentsByStaffRequest } from '@/features/staff/types/get-staff-coordinate-comments-by-staff.request';
import type { CreateStaffProcessRequest } from '@/features/staff/types/create-staff-process.request';
import type { CreateStaffProcessResponse } from '@/features/staff/types/create-staff-process.response';
import type { ActiveStaffProcessRequest } from '@/features/staff/types/active-staff-process.request';
import type { ActiveStaffProcessResponse } from '@/features/staff/types/active-staff-process.response';
import type { DeactiveStaffProcessRequest } from '@/features/staff/types/deactive-staff-process.request';
import type { DeactiveStaffProcessResponse } from '@/features/staff/types/deactive-staff-process.response';
import type { EditStaffProcessRequest } from '@/features/staff/types/edit-staff-process.request';
import type { EditStaffProcessResponse } from '@/features/staff/types/edit-staff-process.response';

export async function searchStaff(request: SearchStaffRequest): Promise<GetStaffsResponse> {
  const params = new URLSearchParams();

  if (request.key !== undefined && request.key !== '') {
    params.append('key', request.key);
  }

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const response = await apiClient.get<GetStaffsResponse>(
    `${API_PATH.COMMON_PORTAL.STAFF}/search?${params.toString()}`,
  );

  return response.data;
}

export async function getStaffDetail(
  id: number | string,
): Promise<GetStaffDetailResponse> {
  const response = await apiClient.get<GetStaffDetailResponse>(
    API_PATH.COMMON_PORTAL.STAFF_DETAIL(id),
  );

  return response.data;
}

export async function getStaffByDepartment(
  request: GetStaffByDepartmentRequest,
): Promise<GetStaffByDepartmentResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const response = await apiClient.get<GetStaffByDepartmentResponse>(
    `${API_PATH.COMMON_PORTAL.STAFF_BY_DEPARTMENT(request.department)}?${params.toString()}`,
  );

  return response.data;
}

export async function createStaffProcess(
  request: CreateStaffProcessRequest,
): Promise<CreateStaffProcessResponse> {
  const response = await apiClient.post<CreateStaffProcessResponse>(
    API_PATH.STAFF.CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function editStaffProcess(
  request: EditStaffProcessRequest,
): Promise<EditStaffProcessResponse> {
  const response = await apiClient.post<EditStaffProcessResponse>(
    API_PATH.STAFF.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function deactiveStaffProcess(
  request: DeactiveStaffProcessRequest,
): Promise<DeactiveStaffProcessResponse> {
  const response = await apiClient.post<DeactiveStaffProcessResponse>(
    API_PATH.STAFF.DEACTIVE_PROCESS,
    request,
  );

  return response.data;
}

export async function activeStaffProcess(
  request: ActiveStaffProcessRequest,
): Promise<ActiveStaffProcessResponse> {
  const response = await apiClient.post<ActiveStaffProcessResponse>(
    API_PATH.STAFF.ACTIVE_PROCESS,
    request,
  );

  return response.data;
}

export async function createStaffCoordinateCommentProcess(
  request: CreateStaffCoordinateCommentProcessRequest,
): Promise<CreateStaffCoordinateCommentProcessResponse> {
  const response = await apiClient.post<CreateStaffCoordinateCommentProcessResponse>(
    API_PATH.STAFF.COORDINATE_COMMENT_CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function editStaffCoordinateCommentProcess(
  request: EditStaffCoordinateCommentProcessRequest,
): Promise<EditStaffCoordinateCommentProcessResponse> {
  const response = await apiClient.post<EditStaffCoordinateCommentProcessResponse>(
    API_PATH.STAFF.COORDINATE_COMMENT_EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function deactiveStaffCoordinateCommentProcess(
  request: DeactiveStaffCoordinateCommentProcessRequest,
): Promise<DeactiveStaffCoordinateCommentProcessResponse> {
  const response = await apiClient.post<DeactiveStaffCoordinateCommentProcessResponse>(
    API_PATH.STAFF.COORDINATE_COMMENT_DEACTIVE_PROCESS,
    request,
  );

  return response.data;
}

export async function activeStaffCoordinateCommentProcess(
  request: ActiveStaffCoordinateCommentProcessRequest,
): Promise<ActiveStaffCoordinateCommentProcessResponse> {
  const response = await apiClient.post<ActiveStaffCoordinateCommentProcessResponse>(
    API_PATH.STAFF.COORDINATE_COMMENT_ACTIVE_PROCESS,
    request,
  );

  return response.data;
}

export async function removeStaffCoordinateCommentProcess(
  request: RemoveStaffCoordinateCommentProcessRequest,
): Promise<RemoveStaffCoordinateCommentProcessResponse> {
  const response = await apiClient.post<RemoveStaffCoordinateCommentProcessResponse>(
    API_PATH.STAFF.COORDINATE_COMMENT_REMOVE_PROCESS,
    request,
  );

  return response.data;
}

export async function getStaffCoordinateCommentsByCategoryApprove(
  request: GetStaffCoordinateCommentsByCategoryRequest,
): Promise<GetStaffCoordinateCommentsByCategoryResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const response = await apiClient.get<GetStaffCoordinateCommentsByCategoryResponse>(
    `${API_PATH.COMMON_PORTAL.STAFF_COORDINATE_COMMENTS_CATEGORY_APPROVE(request.categoryId)}?${params.toString()}`,
  );

  return response.data;
}

export async function getStaffCoordinateCommentsByCategoryNoneApprove(
  request: GetStaffCoordinateCommentsByCategoryRequest,
): Promise<GetStaffCoordinateCommentsByCategoryResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const response = await apiClient.get<GetStaffCoordinateCommentsByCategoryResponse>(
    `${API_PATH.COMMON_PORTAL.STAFF_COORDINATE_COMMENTS_CATEGORY_NONE_APPROVE(request.categoryId)}?${params.toString()}`,
  );

  return response.data;
}

export async function getStaffCoordinateCommentsByStaffApprove(
  request: GetStaffCoordinateCommentsByStaffRequest,
): Promise<GetStaffCoordinateCommentsByCategoryResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const response = await apiClient.get<GetStaffCoordinateCommentsByCategoryResponse>(
    `${API_PATH.COMMON_PORTAL.STAFF_COORDINATE_COMMENTS_STAFF_APPROVE(request.staffId)}?${params.toString()}`,
  );

  return response.data;
}

export async function getStaffCoordinateCommentsByStaffNoneApprove(
  request: GetStaffCoordinateCommentsByStaffRequest,
): Promise<GetStaffCoordinateCommentsByCategoryResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const response = await apiClient.get<GetStaffCoordinateCommentsByCategoryResponse>(
    `${API_PATH.COMMON_PORTAL.STAFF_COORDINATE_COMMENTS_STAFF_NONE_APPROVE(request.staffId)}?${params.toString()}`,
  );

  return response.data;
}
