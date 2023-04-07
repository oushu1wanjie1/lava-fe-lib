import { useRouter } from 'vue-router'
// @ts-ignore
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// @ts-ignore
import { message } from 'ant-design-vue-3'
import qs from 'qs'
// @ts-ignore
import debounce from 'lodash.debounce'
import { messages } from './i18n'
import { h } from 'vue'

// debounce time
const DEBOUNCE_TIME = 2000
const ROUTER_INIT_DELAY = 250
const HTTP_ERROR_UNAUTHORIZED = 401
const HTTP_ERROR_FORBIDDEN = 403
const HTTP_ERROR_BAD_GATEWAY = 502

// Meta信息
export interface Meta {
  success: boolean;
  message: string;
  status_code: string;
  params: any;
}

// 老旧服务的 response，适用于wasp flow
export interface OldResponse<T> {
  code: string | number | undefined,
  message: string,
  data: T
}

// 默认的response
export interface Response<T> {
  meta: Meta;
  data: T;
}

// Http请求自定义配置构造方法的选项
interface Options {
  // 不在页面上显示Meta
  doNotShowMetaErrorMessage: boolean
  // 全局捕捉异常 message error 时不使用 debounce
  doNotShowMetaErrorMessageWithDebounce: boolean
  // 发送时取消上一个请求
  cancelLastRequest: boolean
  // 自定义baseUrl,
  baseURL: string,
  // 阻止默认的http错误处理方法
  preventDefaultHttpErrorHandler: boolean
}

// deprecated - 旧版平铺开的参数写法
type DeprecatedDoNotShowMetaErrorMessageParam = boolean

// 处理wasp/flow旧版response，修改为新版response结构
const handleOldResponse = <T>(response: OldResponse<T>): Response<T> => {
  return {
    meta: {
      success: response.code === 0,
      message: response.message || '',
      status_code: (response.code || response.message).toString(),
      params: ''
    },
    data: response.data
  }
}
// 401（未登录）消息的显示
const handle401Error = debounce(() => {
  if (sessionStorage.getItem('is401') !== '1') {
    sessionStorage.setItem('is401', '1')
    sessionStorage.setItem('LAST_VISITED_PAGE', location.href.replace(location.origin, ''))
    message.error('登录状态已过期，请重新登录')
    setTimeout(() => {
      const router = useRouter()
      if (router) {
        router.push(`${process.env.VUE_APP_PREFIX || ''}/login`).then(() => undefined)
      } else {
        location.href = `${process.env.VUE_APP_PREFIX || ''}/login`
      }
    }, ROUTER_INIT_DELAY)
  }
}, DEBOUNCE_TIME, { leading: true, trailing: false })

// 403（没有权限）消息的显示
const handle403Error = debounce(() => {
  message.warn('您没有权限进行此操作')
}, DEBOUNCE_TIME, { leading: true, trailing: false })

// 502（网关错误）消息的显示
// eslint-disable-next-line @typescript-eslint/no-empty-function
const handle502Error = debounce(() => {
}, DEBOUNCE_TIME, { leading: true, trailing: false })

// 默认的错误消息
// eslint-disable-next-line @typescript-eslint/no-empty-function
const handleDefaultError = debounce(() => {
}, DEBOUNCE_TIME, { leading: true, trailing: false })

// 后台返回错误的默认反馈（显示message）
const showMetaErrorMessageDebounceFunctionFactory = (statusCode: string, legacyMsg?: string) => debounce(() => {
  message.error(messages['zh-CN'].errors[statusCode] || legacyMsg || statusCode)
}, DEBOUNCE_TIME, { leading: true, trailing: false })

// 处理http错误的统一方法
const handleHttpError = (error: Record<string, unknown>, preventDefault: boolean) => {
  if (preventDefault) return
  const { status } = error
  if (status === HTTP_ERROR_UNAUTHORIZED) {
    handle401Error()
  } else if (status === HTTP_ERROR_FORBIDDEN) {
    handle403Error()
  } else if (status === HTTP_ERROR_BAD_GATEWAY) {
    handle502Error()
  } else {
    handleDefaultError()
  }
}

// Http请求自定义配置，使用该类可以新建自定义的http实例
export class CustomHttpOptions implements Options {
  constructor(options: Partial<Options> | DeprecatedDoNotShowMetaErrorMessageParam = {},
    doNotShowMetaErrorMessageWithDebounce = false,
    cancelLastRequest = false) {
    if (typeof options === 'boolean') {
      // 旧版写法
      // eslint-disable-next-line no-console
      console.warn('使用了http选项的旧版写法，即将废弃')
      this.doNotShowMetaErrorMessage = options
      this.doNotShowMetaErrorMessageWithDebounce = doNotShowMetaErrorMessageWithDebounce
      this.cancelLastRequest = cancelLastRequest
    } else {
      this.doNotShowMetaErrorMessage = options.doNotShowMetaErrorMessage || false
      this.doNotShowMetaErrorMessageWithDebounce = options.doNotShowMetaErrorMessageWithDebounce || false
      this.cancelLastRequest = options.cancelLastRequest || false
    }
    this.baseURL = typeof options !== 'boolean' && options.baseURL || `${process.env.VUE_APP_PREFIX || ''}/api`
    this.preventDefaultHttpErrorHandler = false
  }
  baseURL: string
  cancelLastRequest: boolean
  doNotShowMetaErrorMessage: boolean
  doNotShowMetaErrorMessageWithDebounce: boolean
  preventDefaultHttpErrorHandler: boolean
}

// http main
export const customHttp = (options = new CustomHttpOptions() ) => {
  // 取消本次请求的功能，在选项cancelLastRequest为true时启用
  let abortController: AbortController | undefined = undefined
  // 提示后台返回报错的debounce函数列表，保证连续2秒内报同一个错误只显示一条
  const showMetaErrorMessageDebounceFunctionList: Record<string, () => any> = {}
  // 请求配置
  const axiosRequestConfig: AxiosRequestConfig = {
    // 所有请求添加/api前缀
    baseURL: options.baseURL,
    // 对get请求进行querystring处理
    paramsSerializer: (params: any) => {
      return qs.stringify(params, {
        indices: false,
      })
    }
  }

  const http: AxiosInstance = axios.create(axiosRequestConfig)

  // 如果有cancelLastRequest，则触发上一个请求的cancel
  http.interceptors.request.use((config: any) => {
    if (options.cancelLastRequest) {
      if (abortController) abortController.abort()
      abortController = new AbortController()
      config.signal = abortController.signal
    }
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

  http.interceptors.response.use((res: AxiosResponse<Response<unknown> | OldResponse<unknown>>) => {
    // 当返回值不是json类型时，不进行处理直接返回
    // @ts-ignore ['content-type']
    const isjsonData = res.headers['content-type'].includes('application/json')
    if (!isjsonData) {
      return res
    }

    /**
     * 返回值预处理
     */
    let modifyRes: Response<any>
    // 将旧版的Response处理成现行版本
    if ((<OldResponse<unknown>>res.data).code !== undefined) {
      // 该情况下为OldResponse
      modifyRes = handleOldResponse(<OldResponse<unknown>>res.data)
    } else if (!(<Response<unknown>>res.data).meta) {
      // 如果没有meta且没有code，则认为接口格式错误
      return Promise.reject(new Error('接口格式错误:没有meta'))
    } else {
      // 该情况下为现行的Response
      modifyRes = <Response<any>>res.data
    }

    /**
     * meta报错信息处理
     */
    if (!modifyRes.meta.success && !options.doNotShowMetaErrorMessage) {
      if (options.doNotShowMetaErrorMessageWithDebounce) {
        // @ts-ignore
        message.error(h('span', {
          style: { textAlign: 'left' },
          innerHTML: messages['zh-CN'].errors[modifyRes.meta.status_code] || modifyRes.meta.message || modifyRes.meta.status_code
        }))
      } else {
        if (!showMetaErrorMessageDebounceFunctionList[modifyRes.meta.status_code]) {
          showMetaErrorMessageDebounceFunctionList[modifyRes.meta.status_code] = showMetaErrorMessageDebounceFunctionFactory(
            modifyRes.meta.status_code,
            modifyRes.meta.message
          )
        } showMetaErrorMessageDebounceFunctionList[modifyRes.meta.status_code]()
      }
    }
    return modifyRes
  }, (err) => {
    /**
     * http 错误处理
     */
    const errObj: Record<string, unknown> = JSON.parse(JSON.stringify(err))
    handleHttpError(errObj, options.preventDefaultHttpErrorHandler)
    return Promise.reject(err)
  })

  return http
}

export default customHttp()
