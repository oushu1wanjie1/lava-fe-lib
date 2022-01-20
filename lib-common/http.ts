import { useRouter } from "vue-router";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import message from 'ant-design-vue/lib/message'
import 'ant-design-vue/lib/message/style/css'


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
}

const http: AxiosInstance = axios.create(axiosRequestConfig)

http.interceptors.response.use((res: AxiosResponse<Response<any>>) => {
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
      message.error(errObj.message)
      setTimeout(() => {
        useRouter().push('/login')
      })
      return Promise.reject(err)
    }
  }
  return Promise.reject(err)
})

export default http
