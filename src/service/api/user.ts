import request from '../http'
export const getCaptchaApi = (): Promise<API.ResponseData<API.CaptchaRes>> => {
  return request.get('/api/captcha')
}

export const fetchLogin = (data: API.LoginReq): Promise<API.ResponseData<API.LoginResponse>> => {
  return request.post('/api/login', data)
}

// export const logoutApi = (data: API.LogoutReq): Promise<API.ResponseData<API.LogoutRes>> => {
//   return request.post('/api/logout', { data })
// }
// export const getUserInfoApi = (
//   data: API.GetUserInfoReq
// ): Promise<API.ResponseData<API.GetUserInfoResponse>> => {
//   return request.post('/api/userinfo', data)
// }
