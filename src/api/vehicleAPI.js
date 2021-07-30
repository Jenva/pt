import APIHelper from './APIHelper'

export default {
  getStatFromData(params) {
    const url = '/stat-car/statListFromDayStart'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  getStatDetailList(params) {
    const url = '/stat-car/statDetailFromDayStart'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  getRecentListFromRedis(params) {
    const url = '/stat-car/getRecentListFromRedis'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  statListByLimitTime(params) {
    const url = `/stat-car/statListByLimitTime`
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  queryListByParams(offset, limit, params) {
    const url = `/stat-car/queryListByParams/${offset}/${limit}`
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  // 报表柱形图
  statListByCamera(params) {
    const url = '/stat-car/statListByCamera'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  // 报表折线图
  statListByHour(params) {
    const url = '/stat-car/statListByHour'
    return APIHelper.createAxios().get(
      url, { params }
    )
  }
}