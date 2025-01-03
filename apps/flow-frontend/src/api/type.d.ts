interface UserInfo {
  id: number;

  username: string;

  email: string;
}

interface UserLoginRes {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
