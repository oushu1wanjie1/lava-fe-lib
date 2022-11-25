import { useRouter } from 'vue-router'
// @ts-ignore
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// @ts-ignore
import { message } from 'ant-design-vue-3'
import qs from 'qs'
// @ts-ignore
import debounce from 'lodash.debounce'
import { messages } from './i18n'

export const SUCCESS_STATUS_CODE = 200

// Meta信息
export interface Meta {
  success: boolean;
  message: string;
  status_code: string;
  params: any;
}

// 老旧服务的 response，适用于wasp flow
export interface OldResponse<T> {
  code: string | number,
  message: string,
  data: T
}

// 默认的response
export interface Response<T> {
  meta: Meta;
  data: T;
}

// 复合旧版和现行的response，只用于该文件中，用于初始化
type MixResponse<T> = Partial<OldResponse<T> & Response<T>>

// Http请求自定义配置，使用该类可以新建自定义的http实例
export class CustomHttpOptions {
  // 不在页面上显示Meta
  doNotShowMetaErrorMessage = false
  // 发送时取消上一个请求
  cancelLastRequest = false
  constructor() {
    // --
  }
}

// 403（没有权限）消息的显示
const show403Message = debounce(() => {
  message.error('系统错误：没有权限')
}, 2000, { leading: true, trailing: false })

// 后台返回错误的默认反馈（显示message）
const showMetaErrorMessageDebounceFunctionFactory = (statusCode: string, legacyMsg?: string) => debounce(() => {
  // @ts-ignore 有毛病这个ts，key不存在就返回undefined不就完了，又不会报错。。
  message.error(messages['zh-CN'].errors[statusCode] || legacyMsg || statusCode)
}, 2000, { leading: true, trailing: false })

// http main
export const customHttp = (options = new CustomHttpOptions() ) => {
  // 取消本次请求的功能，在选项cancelLastRequest为true时启用
  const abortController = options.cancelLastRequest ? new AbortController() : undefined
  // 提示后台返回报错的debounce函数列表，保证连续2秒内报同一个错误只显示一条
  const showMetaErrorMessageDebounceFunctionList: Record<string, () => any> = {}
  // 请求配置
  const axiosRequestConfig: AxiosRequestConfig = {
    // 所有请求添加/api前缀
    baseURL: '/api',
    // 对get请求进行querystring处理
    paramsSerializer: (params: any) => {
      return qs.stringify(params, {
        indices: false,
      })
    }
  }
  if (abortController) axiosRequestConfig.signal = abortController.signal

  const http: AxiosInstance = axios.create(axiosRequestConfig)

  // 如果有cancelLastRequest，则触发上一个请求的cancel
  http.interceptors.request.use((config: any) => {
    if (abortController) abortController.abort()
    // 添加后端审计用header
    config.headers = {
      ...config.headers,
      // 请求的菜单id
      menuId: sessionStorage.getItem('requestHeaderMenuId') || '',
      // 请求的菜单名称
      menuName: sessionStorage.getItem('requestHeaderMenuName') || ''
    }
    return config
  })

  http.interceptors.response.use((res: AxiosResponse<MixResponse<any>>) => {
    // @ts-ignore ['content-type']
    const isjsonData = res.headers['content-type'].includes('application/json')
    if (!isjsonData) {
      return res
    }
    let modifyRes: Response<any> = { meta: { success: true, message: '', status_code: '', params: '' }, data: undefined }
    // 将旧版的Response处理成现行版本，映射见下面逻辑
    if (res.data.code !== undefined && res.data.meta === undefined) {
      // 该情况下为OldResponse
      modifyRes.meta = {
        success: res.data.code === 0,
        // 当code是空字符串或者undefined的时候，尝试用message代替(有些旧版请求没有code，用message当做code)
        status_code: String((res.data.code === undefined || res.data.code === '') ? res.data.message : res.data.code),
        message: res.data.message || '',
        params: ''
      }
      modifyRes.data = res.data.data
    } else if (res.data.meta !== undefined) {
      // 该情况下为现行的Response
      modifyRes = res.data as Response<any>
    } else {
      // 如果没有meta且没有code，则认为接口格式错误
      message.error('接口格式错误:没有meta')
      return Promise.reject(new Error('接口格式错误:没有meta'))
    }
    // 统一处理meta报错信息
    if (!modifyRes.meta.success && !options.doNotShowMetaErrorMessage) {
      if (!showMetaErrorMessageDebounceFunctionList[modifyRes.meta.status_code]) {
        showMetaErrorMessageDebounceFunctionList[modifyRes.meta.status_code] = showMetaErrorMessageDebounceFunctionFactory(
          modifyRes.meta.status_code,
          modifyRes.meta.message
        )
      } showMetaErrorMessageDebounceFunctionList[modifyRes.meta.status_code]()
    }
    return modifyRes
  }, (err: any) => {
    const errObj: any = JSON.parse(JSON.stringify(err))
    if (errObj.status === 401) {
      if (sessionStorage.getItem('is401') === '1') {
        return err
      } else {
        sessionStorage.setItem('is401', '1')
        console.log('[lava-fe-lib]因接口40111而返回login', location.href.replace(location.origin, ''))
        sessionStorage.setItem('LAST_VISITED_PAGE', location.href.replace(location.origin, ''))
        message.error('登录状态已过期，请重新登录')
        setTimeout(() => {
          const router = useRouter()
          if (router) {
            router.push('/login')
          } else {
            location.href = '/login'
          }
        }, 250)

        return Promise.reject(err)
      }
    } else if (errObj.status === 403) {
      show403Message()
    } else if (/^(4|5)[0-9]{2}$/.test(errObj.status)) {
      message.error(errObj.message)
    }

    return Promise.reject(err)
  })

  return http
}

export default customHttp()
