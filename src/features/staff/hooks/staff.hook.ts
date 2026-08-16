import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  activeStaffCoordinateCommentProcess,
  getStaffCoordinateCommentById,
  activeStaffProcess,
  createStaffProcess,
  createStaffCoordinateCommentProcess,
  deactiveStaffProcess,
  deactiveStaffCoordinateCommentProcess,
  editStaffCoordinateCommentProcess,
  editStaffProcess,
  removeStaffCoordinateCommentProcess,
  searchStaff,
} from '@/features/staff/api/staff.api';
import type { GetStaffsResponse } from '@/features/staff/types/get-staffs.response';
import type { SearchStaffRequest } from '@/features/staff/types/search-staff.request';
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
import type { GetStaffCoordinateCommentResponse } from '@/features/staff/types/get-staff-coordinate-comment.response';
import type { ActiveStaffProcessRequest } from '@/features/staff/types/active-staff-process.request';
import type { ActiveStaffProcessResponse } from '@/features/staff/types/active-staff-process.response';
import type { CreateStaffProcessRequest } from '@/features/staff/types/create-staff-process.request';
import type { CreateStaffProcessResponse } from '@/features/staff/types/create-staff-process.response';
import type { DeactiveStaffProcessRequest } from '@/features/staff/types/deactive-staff-process.request';
import type { DeactiveStaffProcessResponse } from '@/features/staff/types/deactive-staff-process.response';
import type { EditStaffProcessRequest } from '@/features/staff/types/edit-staff-process.request';
import type { EditStaffProcessResponse } from '@/features/staff/types/edit-staff-process.response';
import { QUERY_KEY } from '@/shared/api';

export function useSearchStaffQuery(request: SearchStaffRequest) {
  return useQuery<GetStaffsResponse>({
    queryKey: QUERY_KEY.STAFF_SEARCH(request),
    queryFn: () => searchStaff(request),
  });
}

export function useStaffCoordinateCommentQuery(id?: number | string) {
  return useQuery<GetStaffCoordinateCommentResponse>({
    queryKey: id ? QUERY_KEY.STAFF_COORDINATE_COMMENT(id) : QUERY_KEY.STAFF_COORDINATE_COMMENT(''),
    queryFn: () => getStaffCoordinateCommentById(id as number | string),
    enabled: id !== undefined && id !== null && id !== '',
  });
}

export function useCreateStaffProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateStaffProcessResponse, Error, CreateStaffProcessRequest>({
    mutationFn: createStaffProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}

export function useEditStaffProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<EditStaffProcessResponse, Error, EditStaffProcessRequest>({
    mutationFn: editStaffProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}

export function useDeactiveStaffProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    DeactiveStaffProcessResponse,
    Error,
    DeactiveStaffProcessRequest
  >({
    mutationFn: deactiveStaffProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}

export function useActiveStaffProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<ActiveStaffProcessResponse, Error, ActiveStaffProcessRequest>({
    mutationFn: activeStaffProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}

export function useCreateStaffCoordinateCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateStaffCoordinateCommentProcessResponse,
    Error,
    CreateStaffCoordinateCommentProcessRequest
  >({
    mutationFn: createStaffCoordinateCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}

export function useEditStaffCoordinateCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    EditStaffCoordinateCommentProcessResponse,
    Error,
    EditStaffCoordinateCommentProcessRequest
  >({
    mutationFn: editStaffCoordinateCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}

export function useDeactiveStaffCoordinateCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    DeactiveStaffCoordinateCommentProcessResponse,
    Error,
    DeactiveStaffCoordinateCommentProcessRequest
  >({
    mutationFn: deactiveStaffCoordinateCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}

export function useActiveStaffCoordinateCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ActiveStaffCoordinateCommentProcessResponse,
    Error,
    ActiveStaffCoordinateCommentProcessRequest
  >({
    mutationFn: activeStaffCoordinateCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}

export function useRemoveStaffCoordinateCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    RemoveStaffCoordinateCommentProcessResponse,
    Error,
    RemoveStaffCoordinateCommentProcessRequest
  >({
    mutationFn: removeStaffCoordinateCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.STAFF });
    },
  });
}
