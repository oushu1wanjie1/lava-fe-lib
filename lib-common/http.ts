import { useRouter } from 'vue-router'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// @ts-ignore
import { message } from 'ant-design-vue-3'
import qs from 'qs'
// @ts-ignore
import debounce from 'lodash.debounce'
import { messages } from './i18n'


// const TIMEOUT = 10000
export const SUCCESS_STATUS_CODE = 200

export interface Meta {
  success: boolean;
  message: string;
  status_code: string;
  params: any;
}

// 老旧服务的 response，适用于wasp flow
export interface OldResponse<T> {
  code: number,
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

export class CustomHttpOptions {
  // 不在页面上显示Meta
  doNotShowMetaErrorMessage = false
  // 发送时取消上一个请求
  cancelLastRequest = false
  constructor() {
    // --
  }
}

const show403Message = debounce(() => {
  message.error('系统错误：没有权限')
}, 2000, { leading: true, trailing: false })

const showMetaErrorMessageDebounceFunctionFactory = (statusCode: string) => debounce(() => {
  // @ts-ignore 有毛病这个ts，key不存在就返回undefined不就完了，又不会报错。。
  message.error(messages['zh-CN'].errors[statusCode] || statusCode)
}, 2000, { leading: true, trailing: false })

export const customHttp = (options = new CustomHttpOptions() ) => {
  const abortController = options.cancelLastRequest ? new AbortController() : undefined
  const showMetaErrorMessageDebounceFunctionList: Record<string, () => any> = {}
  const axiosRequestConfig: AxiosRequestConfig = {
    baseURL: '/api',
    // timeout: TIMEOUT,
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false,
      })
    }
  }

  if (abortController) axiosRequestConfig.signal = abortController.signal

  const http: AxiosInstance = axios.create(axiosRequestConfig)

  // 如果有cancelLastRequest，则触发上一个请求的cancel
  http.interceptors.request.use((config) => {
    if (abortController) abortController.abort()
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
        status_code: String(res.data.code),
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
          modifyRes.meta.status_code || modifyRes.meta.message
        )
      } showMetaErrorMessageDebounceFunctionList[modifyRes.meta.status_code]()
    }
    return modifyRes
  }, (err) => {
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
