export const API_PATH = {
  AUTH: {
    LOGIN: '/login',
    CHECK_TOKEN_EXPIRED: '/check-token-expired',
    REFRESH_TOKEN: '/refresh-token',
  },
  ADMIN: {
    SIGNUP: '/admin/signup',
  },
  STAFF: {
    CREATE_PROCESS: '/admin/staff/create/process',
    EDIT_PROCESS: '/admin/staff/edit/process',
    DEACTIVE_PROCESS: '/admin/staff/deactive/process',
    ACTIVE_PROCESS: '/admin/staff/active/process',
    COORDINATE_COMMENT_CREATE_PROCESS: '/admin/staff/coordinate-comment/create/process',
    COORDINATE_COMMENT_EDIT_PROCESS: '/admin/staff/coordinate-comment/edit/process',
    COORDINATE_COMMENT_DEACTIVE_PROCESS: '/admin/staff/coordinate-comment/deactive/process',
    COORDINATE_COMMENT_ACTIVE_PROCESS: '/admin/staff/coordinate-comment/active/process',
    COORDINATE_COMMENT_REMOVE_PROCESS: '/admin/staff/coordinate-comment/remove/process',
  },
  HOTLINE: {
    CREATE_PROCESS: '/admin/hotline/create/process',
    REMOVE_PROCESS: '/admin/hotline/remove/process',
  },
  ZALO: {
    POST_COMMENT_PROCESS: '/zalo/post-comment/process',
  },
  DASHBOARD: {
    EDIT_PROCESS: '/admin/dashboard/edit/process',
  },
  FEEDBACK: {
    CREATE_PROCESS: '/admin/feedback/create/process',
    EDIT_PROCESS: '/admin/feedback/edit/process',
    APPROVE_PROCESS: '/admin/feedback/approve/process',
  },
  CATEGORY_COMMENT: {
    CREATE_PROCESS: '/admin/category/comment/create/process',
    EDIT_PROCESS: '/admin/category/comment/edit/process',
    REMOVE_PROCESS: '/admin/category/comment/remove/process',
  },
  CATEGORY_MEDIA: {
    CREATE_PROCESS: '/admin/category/media/create/process',
    EDIT_PROCESS: '/admin/category/media/edit/process',
    REMOVE_PROCESS: '/admin/category/media/remove/process',
  },
  CATEGORY_NEWS: {
    CREATE_PROCESS: '/admin/category/news/create/process',
    EDIT_PROCESS: '/admin/category/news/edit/process',
    REMOVE_PROCESS: '/admin/category/news/remove/process',
  },
  DEPARTMENT: {
    CREATE_PROCESS: '/admin/department/create/process',
    EDIT_PROCESS: '/admin/department/edit/process',
    REMOVE_PROCESS: '/admin/department/remove/process',
  },
  CITIZEN: {
    EDIT_PROCESS: '/admin/citizen/edit/process',
  },
  DIVISION: {
    CREATE_PROCESS: '/admin/division/create/process',
    EDIT_PROCESS: '/admin/division/edit/process',
    REMOVE_PROCESS: '/admin/division/remove/process',
  },
  NEWS: {
    POST_PROCESS: '/admin/news/post/process',
    EDIT_PROCESS: '/admin/news/edit/process',
    APPROVAL_PROCESS: '/admin/news/approval/process',
    REMOVE_PROCESS: '/admin/news/remove/process',
  },
  MEDIA: {
    POST_PROCESS: '/admin/media/post/process',
    EDIT_PROCESS: '/admin/media/edit/process',
    APPROVAL_PROCESS: '/admin/media/approval/process',
    REMOVE_PROCESS: '/admin/media/remove/process',
  },
  UPLOAD: {
    IMAGE: '/upload-files/image',
    PDF: '/upload-files/pdf',
    AUDIO: '/upload-files/audio',
  },
  COMMON: {
    HOTLINE: '/common/hotline',
    DASHBOARD: '/common/dashboard',
    DEPARTMENTS: '/common/departments',
    DEPARTMENT: '/common/department',
    DIVISIONS: '/common/divisions',
    NEWS_PUBLIC_SEARCH: '/common/news/public/search',
    CATEGORIES: (type: number) => `/common/categorys/${type}`,
  },
  COMMON_PORTAL: {
    COMMENTS: '/common-portal/comments',
    COMMENT: (cUuid: string) => `/common-portal/comments/get/${cUuid}`,
    CITIZEN: '/common-portal/citizen',
  },
} as const;
