import APIHelper from './APIHelper'

export default {
  getGroupList (params) {
    const url = '/group/list'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  addGroup (params) {
    const url = '/group/save'
    return APIHelper.createAxios().post(
      url, params
    )
  },
  editGroup (id, params) {
    const url = `/group/edit/${id}`
    return APIHelper.createAxios().put(
      url, params
    )
  },
  deleteGroup (id) {
    const url = `/group/delete/${id}`
    return APIHelper.createAxios().delete(
      url
    )
  },
  cameraList (params) {
    const url = '/camera-areas/listByGroupId'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  saveCamera (params) {
    const url = '/camera-areas/save'
    return APIHelper.createAxios().post(
      url, params 
    )
  },
  updateCamera (id, params) {
    const url = `/camera-areas/update/${id}`
    return APIHelper.createAxios().post(
      url, params 
    )
  }
}