import request from '../http'
export const getCaptchaApi = (): Promise<API.ResponseData<API.CaptchaRes>> => {
  return request.get('/api/captcha')
}
/**
 * 用户登录接口
 * @description 处理用户的登录请求，验证用户名和密码，返回登录结果
 * @param data 登录参数对象
 * @param data.username 用户名
 * @param data.password 密码
 * @returns 返回登录响应信息，包含token和用户基本信息
 * @throws 当登录失败时抛出相应的错误信息
 */
export const fetchLogin = (data: API.LoginReq): Promise<API.ResponseData<API.LoginResponse>> => {
  return request.post('/api/login', data)
}

/**
 * 获取用户菜单
 * @description 获取用户的菜单信息，用于构建用户界面的导航菜单
 * @returns 返回用户菜单响应信息，包含菜单列表
 * @throws 当获取菜单失败时抛出相应的错误信息
 */
export const fetchGetMyMenu = (): Promise<API.ResponseData<API.LoginResponse>> => {
  return request.get('/api/menus')
}

// export const logoutApi = (data: API.LogoutReq): Promise<API.ResponseData<API.LogoutRes>> => {
//   return request.post('/api/logout', { data })
// }
// export const getUserInfoApi = (
//   data: API.GetUserInfoReq
// ): Promise<API.ResponseData<API.GetUserInfoResponse>> => {
//   return request.post('/api/userinfo', data)
// }
