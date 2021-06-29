/**
 * Created by chris on 2017/8/1.
 */
// https://github.com/mzabriskie/axiosff
import axios from 'axios'
import { Notification } from 'element-ui'
import qs from 'qs'
export default {
  filePrefix: process.env.MICRO_API_PREFIX,
  baseURL: process.env.VUE_APP_REFIX,
  // createAxios (config = []) {
  //   // b = [...config, {}]
  //   const baseConfig = {
  //     // baseURL: 'http://localhost:8080',
  //     baseURL: process.env.VUE_APP_REFIX,
  //     timeout: 15000,
  //     headers: {
  //       // 'X-Custom-Header': 'foobar', // this cannot be work in cross domain mode!!!!
  //       // "Access-Control-Allow-Headers":"*",
  //       // "Access-Control-Allow-Origin"
  //       // "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
  //     },
  //     // 'Content-Type': 'application/x-www-form-urlencoded',
  //     // 自定义520 http status支持, 否则520会认为是http状态异常
  //     validateStatus (status) {
  //       // console.log('validateStatus:status[' + status + ']')
  //       return (status >= 200 && status < 300) || status === 520 // default
  //     },
  //     transformRequest: [(data) => {
  //       console.log(data)
  //       return data
  //     }]
  //   }
  //   const fullConfig = Object.assign({}, baseConfig, config)
  //   // console.log("AJAX Request:")
  //   // console.log(fullConfig)
  //   const axiosInstance = axios.create(fullConfig)
  //   axiosInstance.interceptors.response.use((res) => {
  //     if (res.status === 520) {
  //       if (res.data.errorCode === '11019') {
  //         Notification.error({
  //           title: res.data.errorMsg
  //         })
  //         // window.location.href = `http://${window.location.host}${PREFIX_SERVER}${window.location.pathname}#/login`
  //         window.location.href = `http://${window.location.host}${window.location.pathname}#/login`
  //       }
  //       if (res.data.errorCode === '11024') {
  //         console.log('reponse', res.data)
  //         Notification.error({
  //           title: res.data.errorMsg,
  //           desc: '接口权限缺失：' + (res.config.url).split('api')[1]
  //         })
  //       }
  //     } else if (res.status >= 500 && res.status < 520) {
  //       Notification.error({
  //         title: '系统服务异常！'
  //       })
  //     }
  //     return res
  //   })
  //   // return axios.create(fullConfig)
  //   return axiosInstance
  // },
  createAxios (config = []) {
    const baseConfig = {
      baseURL: process.env.VUE_APP_REFIX,
      timeout: 20000,
      paramsSerializer: (params) => {
        const newParams = { ...params }
        for (const key in newParams) {
          if (newParams[key] instanceof Date) continue  // 过滤空参数
          if (newParams[key] === undefined || newParams[key] === null || newParams[key] === '') {
            delete newParams[key]
            continue
          }
          if ((Object.keys(newParams[key]).length === 0 && newParams[key] instanceof Object) || (newParams[key].length === 0 && newParams[key] instanceof Array)) {
            delete newParams[key]
            continue
          }
          if (newParams[key] && newParams[key].constructor && newParams[key].constructor === Object) {
            newParams[key] = JSON.stringify(newParams[key])
          }
        }
        return qs.stringify(newParams, { arrayFormat: 'repeat' })
      }
    }
    baseConfig.headers = Object.assign({}, baseConfig.headers, process.env.REST_HEADERS)
    const microAccessToken = sessionStorage.getItem('microAccessToken')
    if (microAccessToken && microAccessToken.indexOf('undefined') === -1) {
      baseConfig.headers = Object.assign({}, baseConfig.headers, {
        Authorization: microAccessToken
      })
    }
    const fullConfig = Object.assign({}, baseConfig, config)
    const axiosInstance = axios.create(fullConfig)
    axiosInstance.interceptors.request.use((config) => {
      // if (config.url.indexOf('token') > -1) { // 登录或刷新令牌跳过
      //   return config
      // }
      // // 过期存在且2小时内过期，刷新令牌
      // const expiredTime = window.sessionStorage.getItem('expiredTime')
      // if (expiredTime && moment(expiredTime) && moment(expiredTime).isBefore(moment())) {
      //   window.sessionStorage.removeItem('userInfo')
      //   window.sessionStorage.removeItem('accessToken')
      //   window.sessionStorage.removeItem('microAccessToken')
      //   Notification.error({
      //     title: '登录过期'
      //   })
      //   setTimeout(() => {
      //     if (window.cef_core) {
      //       window.cef_core.loginOut()
      //     } else {
      //       window.location.href = `http://${window.location.host}${window.location.pathname}/#/login`
      //     }
      //   }, 2000)
      //   return
      // }
      // if (expiredTime && moment(expiredTime) && moment(expiredTime).subtract(2, 'h').isBefore(moment())) {
      //   if (window.isRefreshToken === false) {
      //     window.isRefreshToken = true
      //   }
      //   store.dispatch('tokenRefresh')
      //   const retry = new Promise((resolve, reject) => {
      //     window.tokenRefreshQueue.push((token) => {
      //       config.headers.Authorization = token
      //       // 将请求挂起
      //       resolve(config)
      //     })
      //   })
      //   return retry
      // }
      return config
    })
    axiosInstance.interceptors.response.use((res) => {
      return res
    }, (error) => {
      if (error.response) {
        // 发送请求后，服务端返回的响应码不是 2xx
        const res = error.response
        if (res.status === 401 && res.data.error === 'invalid_token') {
          window.sessionStorage.removeItem('userInfo')
          window.sessionStorage.removeItem('accessToken')
          window.sessionStorage.removeItem('microAccessToken')
          Notification.error({
            title: '登录过期'
          })
          setTimeout(() => {
            if (window.cef_core) {
              window.cef_core.loginOut()
            } else {
              window.location.href = `http://${window.location.host}${window.location.pathname}/#/login`
            }
          }, 2000)
        } else {
          Notification.error({
            title: res.data.error
          })
        }
      } else if (error.request) {
        // 发送请求但是没有响应返回
        console.log(error.request)
      } else {
        // 其他错误
        console.log('Error', error.message)
      }
      return Promise.reject(error)
    })
    return axiosInstance
  },
}
