import { useRouter } from 'vue-router'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// @ts-ignore
import { message } from 'ant-design-vue-3'
import qs from 'qs'
// @ts-ignore
import debounce from 'lodash.debounce'


// const TIMEOUT = 10000
export const SUCCESS_STATUS_CODE = 200

export interface Meta {
  success: boolean;
  message: string;
  status_code: string;
  params: any;
}

export interface Response<T> {
  meta: Meta;
  data: T;
}

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: '/api',
  // timeout: TIMEOUT,
  paramsSerializer: params => {
    return qs.stringify(params, {
      indices: false,
    })
  }
}

const show403Message = debounce(() => { message.error('系统错误：没有权限') }, 2000, { leading: true, trailing: false })

const http: AxiosInstance = axios.create(axiosRequestConfig)

http.interceptors.response.use((res: AxiosResponse<Response<any>>) => {
  // @ts-ignore ['content-type']
  const isjsonData = res.headers['content-type'].includes('application/json')
  if (!isjsonData) {
    return res
  }
  if (!res.data.meta) {
    message.error('接口格式错误:没有meta')
    return Promise.reject(new Error('接口格式错误:没有meta'))
  }
  return {
    ...(res.data || {}),
    meta: res.data.meta || {},
  }
}, (err) => {
  const errObj: any = JSON.parse(JSON.stringify(err))
  if (errObj.status === 401) {
    if (sessionStorage.getItem('is401') === '1') {
      return err
    } else {
      sessionStorage.setItem('is401', '1')
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

export default http
