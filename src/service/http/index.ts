import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type ResponseType,
} from 'axios'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores'
import { router } from '@/router'

// 请求响应参数，包含 data
export type ResultData<T = any> = {
  code: number
  msg: string
  data: T
}
// 响应里的 code 返回值约定码枚举
enum ResponseEnums {
  SUCCESS = 0, // 请求成功
  BAD_REQUEST = 400, // 错误的请求
  INTERNAL_SERVER_ERROR = 500, // 服务器内部错误
}

const baseURL: string = import.meta.env.VITE_BASE_URL
const config = {
  // 默认地址
  baseURL,
  // 设置超时时间
  timeout: 20000,
  // 跨域时候允许携带凭证
  withCredentials: true,
  // headers: {
  //   Authorization: 'token' // 请求头中携带 token 信息
  // }
}

class RequestHttp {
  // 定义成员变量并指定类型
  service: AxiosInstance
  public constructor(config: AxiosRequestConfig) {
    // 实例化 axios
    this.service = axios.create(config)

    /**
     * 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token 校验 (JWT) : 接受服务器返回的 token，存储到 pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        const userStore = useAuthStore()
        const token = userStore.token
        // 检查 token 存在与否
        if (token && config.headers) {
          const isTokenExpired = Date.now() >= userStore.tokenExpiresTime
          if (isTokenExpired) {
            userStore.logOut()
            message.error('登录过期，请重新登录')
          } else {
            config.headers = config.headers || {}
            config.headers['X-Token'] = token // 直接设置 token
          }
        } else {
          router.push({ name: 'Login' })
          // console.log('Token 不存在')
        }
        return config
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error)
      }
    )

    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端 JS 获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        // 这里可以处理正常的响应
        // console.log('请求response:', response)
        const { data, status } = response;
        if (status >= 200 && status < 300) {
          // if (data.code === ResponseEnums.UNAUTHORIZED) {
          //   // 登录信息失效，应跳转到登录页面，并清空本地的 token
          //   // localStorage.setItem('token', '')
          //   // router.push({ name: 'Login' })
          //   return Promise.reject(data)
          // }
          // 全局错误信息拦截（防止下载文件得时候返回数据流，没有 code，直接报错）
          if (data.code !== ResponseEnums.SUCCESS) {
            message.error(data.msg) // 此处也可以使用组件提示报错信息
            return Promise.reject(data)
          }
          return data; // 正常处理
        } else {
          // 处理非正常响应
          return Promise.reject(new Error(`请求失败，状态码: ${status}`));
        }
      },
      (error: AxiosError) => {
        const { response } = error
        if (response) {
          this.handleCode(response.status)
        }
        if (!window.navigator.onLine) {
          message.error('网络连接失败')
          // 可以跳转到错误页面，也可以不做操作
          // return router.replace({
          //   path: '/404'
          // });
        }
      }
    )
  }
  handleCode(code: number): void {
    switch (code) {
      case 400:
        message.error('请求错误，状态码 400');
        break;
      case 401:
        message.error('未授权，状态码 401');
        // 这里可以跳转到登录页面，并清空本地的 token
        break;
      case 403:
        message.error('拒绝访问，状态码 403');
        break;
      case 404:
        message.error('请求的资源未找到，状态码 404');
        break;
      case 500:
        message.error('服务器内部错误，状态码 500');
        break;
      default:
        message.error('请求失败: ' + code)
        break
    }
  }

  // 常用方法封装
  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.get(url, { params })
  }
  post<T>(url: string, data?: object, responseType: ResponseType = 'json'): Promise<ResultData<T>> {
    return this.service.post(url, data, { responseType });
  }
  put<T>(url: string, data?: object): Promise<ResultData<T>> {
    return this.service.put(url, data)
  }
  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.delete(url, { params })
  }
}

// 导出一个实例对象
export default new RequestHttp(config)
