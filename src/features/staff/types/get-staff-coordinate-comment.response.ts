export type StaffCoordinateCommentItem = {
  id: number;
  time_create_number: number;
  time_create: string | null;
  time_deactive: string | null;
  status: number;
  comments_category_item: number;
  comments_category_name: string | null;
  staff_item: number;
  approval: number;
  staff_name: string | null;
};

export type GetStaffCoordinateCommentResponse = StaffCoordinateCommentItem;
