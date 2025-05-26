import request from '../http'
export const getCaptchaApi = (): Promise<API.ResponseData<API.RespDataMessage>> => {
  return request.get('/api/Captcha')
}
