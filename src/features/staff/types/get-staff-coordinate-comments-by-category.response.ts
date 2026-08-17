import type { StaffCoordinateCommentItem } from '@/features/staff/types/get-staff-coordinate-comment.response';

export type StaffCoordinateCommentPage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetStaffCoordinateCommentsByCategoryResponse = {
  content: StaffCoordinateCommentItem[];
  page: StaffCoordinateCommentPage;
};
