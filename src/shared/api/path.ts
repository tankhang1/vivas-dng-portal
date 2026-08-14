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
  },
  COMMON: {
    HOTLINE: '/common/hotline',
    DASHBOARD: '/common/dashboard',
  },
} as const;
