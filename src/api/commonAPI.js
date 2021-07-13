import APIHelper from "./APIHelper"

export default {
  getALLDict () {
    const url = '/dict-detail/getAllDictMap'
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