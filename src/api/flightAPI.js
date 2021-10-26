import APIHelper from './APIHelper'

export default {
  flightGroup (params) {
    const url = '/flight-stand/listWithGroup'
    return APIHelper.createAxios().get(url, {
      params
    })
  },
  getByFlightStand (params) {
    const url = '/flight-dynamic/getByFlightStand'
    return APIHelper.createAxios().get(url, {
      params
    })
  },
  queryListByParams (offset,limit, params) {
    const url = `/stat-aircraft/queryListByParams/${offset}/${limit}`
    return APIHelper.createAxios().get(url, {
      params
    })
  }
}