import APIHelper from "./APIHelper"

export default {
  getALLDictMap () {
    const url = '/dict-detail/getAllDictMap'
    return APIHelper.createAxios().get(
      url
    )
  },
  getALLDict () {
    const url = '/dict/list'
    return APIHelper.createAxios().get(
      url
    )
  },
  getDictByValue (params) {
    const url = '/dict-detail/list'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  addDictDetail (params) {
    const url = '/dict-detail/save'
    return APIHelper.createAxios().post(
      url, params 
    )
  },
  editDictDetail (id, params) {
    const url = `/dict-detail/update/${id}`
    return APIHelper.createAxios().put(
      url, params 
    )
  },
  deleteDictDetail (id) {
    const url = `/dict-detail/delete/${id}`
    return APIHelper.createAxios().delete(
      url
    )
  },
  addDict (params) {
    const url = '/dict/save'
    return APIHelper.createAxios().post(
      url, params
    )
  },
  editDict (id, params) {
    const url = `/dict/${id}`
    return APIHelper.createAxios().put(
      url, params
    )
  },
  deleteDict (id, params) {
    const url = `/dict/delete/${id}`
    return APIHelper.createAxios().delete(
      url, params
    )
  },
  getCameraList (params) {
    const url = '/camera/list'
    return APIHelper.createAxios().get(
      url, { params }
    )
  },
  downloadFile (fileId) {
    const url = APIHelper.filePrefix + `/file/downloadFile?fileId=${fileId}`
    return url
  }
}