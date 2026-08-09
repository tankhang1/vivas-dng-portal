import { setAccessToken } from '../../../shared/api';
import type { AuthLoginRequest } from '../types/auth.request';
import type { AuthLoginResponse } from '../types/auth.response';

const MOCK_LOGIN = {
  username: 'admin',
  password: 'admin123',
};

export async function login(request: AuthLoginRequest): Promise<AuthLoginResponse> {
  if (
    request.username !== MOCK_LOGIN.username ||
    request.password !== MOCK_LOGIN.password
  ) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
  }

  const response = {
    accessToken: 'mock-access-token',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    user: {
      id: '1',
      username: request.username,
      displayName: 'Nguyễn Văn A',
      role: 'Super Admin',
    },
  };

  setAccessToken(response.accessToken);

  return response;
}
