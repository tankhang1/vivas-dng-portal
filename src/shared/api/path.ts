export const API_PATH = {
  AUTH: {
    LOGIN: '/login',
    CHECK_TOKEN_EXPIRED: '/check-token-expired',
    REFRESH_TOKEN: '/refresh-token',
  },
  ADMIN: {
    SIGNUP: '/admin/signup',
  },
  HOTLINE: {
    CREATE_PROCESS: '/admin/hotline/create/process',
    REMOVE_PROCESS: '/admin/hotline/remove/process',
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
  },
} as const;
