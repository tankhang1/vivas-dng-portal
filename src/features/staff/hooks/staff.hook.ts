import { useMutation } from '@tanstack/react-query';

import {
  activeStaffCoordinateCommentProcess,
  activeStaffProcess,
  createStaffProcess,
  createStaffCoordinateCommentProcess,
  deactiveStaffProcess,
  deactiveStaffCoordinateCommentProcess,
  editStaffCoordinateCommentProcess,
  editStaffProcess,
  removeStaffCoordinateCommentProcess,
} from '@/features/staff/api/staff.api';
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
import type { ActiveStaffProcessRequest } from '@/features/staff/types/active-staff-process.request';
import type { ActiveStaffProcessResponse } from '@/features/staff/types/active-staff-process.response';
import type { CreateStaffProcessRequest } from '@/features/staff/types/create-staff-process.request';
import type { CreateStaffProcessResponse } from '@/features/staff/types/create-staff-process.response';
import type { DeactiveStaffProcessRequest } from '@/features/staff/types/deactive-staff-process.request';
import type { DeactiveStaffProcessResponse } from '@/features/staff/types/deactive-staff-process.response';
import type { EditStaffProcessRequest } from '@/features/staff/types/edit-staff-process.request';
import type { EditStaffProcessResponse } from '@/features/staff/types/edit-staff-process.response';

export function useCreateStaffProcessMutation() {
  return useMutation<CreateStaffProcessResponse, Error, CreateStaffProcessRequest>({
    mutationFn: createStaffProcess,
  });
}

export function useEditStaffProcessMutation() {
  return useMutation<EditStaffProcessResponse, Error, EditStaffProcessRequest>({
    mutationFn: editStaffProcess,
  });
}

export function useDeactiveStaffProcessMutation() {
  return useMutation<
    DeactiveStaffProcessResponse,
    Error,
    DeactiveStaffProcessRequest
  >({
    mutationFn: deactiveStaffProcess,
  });
}

export function useActiveStaffProcessMutation() {
  return useMutation<ActiveStaffProcessResponse, Error, ActiveStaffProcessRequest>({
    mutationFn: activeStaffProcess,
  });
}

export function useCreateStaffCoordinateCommentProcessMutation() {
  return useMutation<
    CreateStaffCoordinateCommentProcessResponse,
    Error,
    CreateStaffCoordinateCommentProcessRequest
  >({
    mutationFn: createStaffCoordinateCommentProcess,
  });
}

export function useEditStaffCoordinateCommentProcessMutation() {
  return useMutation<
    EditStaffCoordinateCommentProcessResponse,
    Error,
    EditStaffCoordinateCommentProcessRequest
  >({
    mutationFn: editStaffCoordinateCommentProcess,
  });
}

export function useDeactiveStaffCoordinateCommentProcessMutation() {
  return useMutation<
    DeactiveStaffCoordinateCommentProcessResponse,
    Error,
    DeactiveStaffCoordinateCommentProcessRequest
  >({
    mutationFn: deactiveStaffCoordinateCommentProcess,
  });
}

export function useActiveStaffCoordinateCommentProcessMutation() {
  return useMutation<
    ActiveStaffCoordinateCommentProcessResponse,
    Error,
    ActiveStaffCoordinateCommentProcessRequest
  >({
    mutationFn: activeStaffCoordinateCommentProcess,
  });
}

export function useRemoveStaffCoordinateCommentProcessMutation() {
  return useMutation<
    RemoveStaffCoordinateCommentProcessResponse,
    Error,
    RemoveStaffCoordinateCommentProcessRequest
  >({
    mutationFn: removeStaffCoordinateCommentProcess,
  });
}
