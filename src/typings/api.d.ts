declare namespace API {
  type ResponseData<T> = {
    code: number;
    msg: string;
    data: T;
  };
  type RespDataMessage = {
    message: string;
  };
  type Pagination = {
    page: number;
    pageSize: number;
  };
  /* 验证码 */
  type CaptchaRes = {
    captchaId: string;
    picture: string;
    expireTime: string;
  };
  type LoginReq = {
    account: string;
    password: string;
    // captcha: string;
  };
  type LoginResponse = {
    token: string;
    expireTime: number;
    userInfo: UserInfo;
  };
  type UserInfo = {
    id: number;
    account: string;
    nickname: string;
    avatar: string;
    role: string;
  }
}
