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
    const url = '/stat-car/statListByLimitTime'
    return APIHelper.createAxios().get(
      url, { params }
    )
  }
}