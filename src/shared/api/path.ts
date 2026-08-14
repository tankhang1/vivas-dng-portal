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
  COMMON: {
    HOTLINE: '/common/hotline',
    DASHBOARD: '/common/dashboard',
  },
} as const;
