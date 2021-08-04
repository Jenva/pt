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
    const url = `/group/update/${id}`
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
  getCameraListByGroupId (params) {
    const url = '/camera-areas/listByGroupId'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  getCameraList(params) {
    const url = '/camera-areas/list'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  saveCamera (id, params) {
    // const url = '/camera-areas/save'
    const url = `/camera-areas/saveBatch/${id}`
    return APIHelper.createAxios().post(
      url, params 
    )
  },
  updateCamera (id, params) {
    const url = `/camera-areas/update/${id}`
    return APIHelper.createAxios().put(
      url, params 
    )
  },
  listSonByParent (params) {
    const url = `/group/listSonByParent`
    return APIHelper.createAxios().get(
      url, {params} 
    )
  }
}