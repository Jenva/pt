
import APIHelper from './APIHelper'

export default {
  getRealTimeFromRedis (params) {
    const url = '/stat-passenger/getRealTimeFromRedis'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  getTaskPageList (pageNum, pageSize) {
    const url = `/task2/list/${pageNum}/${pageSize}`
    return APIHelper.createAxios().get(
      url
    )
  },
  addTask (params) {
    const url = '/task2/save'
    return APIHelper.createAxios().post(
      url, params
    )
  },
  bootTask (id) {
    const url = `/task2/boot/${id}`
    return APIHelper.createAxios().put(
      url
    )
  },
  updateTask (id, params) {
    const url = `/task2/update/${id}`
    return APIHelper.createAxios().put(
      url, params
    )
  },
  getRealTimeByGroupId (params) {
    const url = `/stat-passenger/getRealTimeByGroupId`
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  listByGroupId (params) {
    const url = `/camera-areas/listByGroupId`
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  queryListByParams (offset, limit, params) {
    const url = `/stat-passenger/queryListByParams/${offset}/${limit}`
    return APIHelper.createAxios().get(
      url, { params }
    )
  }
}