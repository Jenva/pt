export default {
  getDisplayDict (type, dictArr) {
    let dictNames
    if (Array.isArray(type)) {
      dictNames = dictArr.filter(item => type.includes(item.detailValue))
      return dictNames ? dictNames.map(item => item.detailName).join(',') : '-'
    } else {
      dictNames = dictArr.find(item => type.toString() === item.detailValue.toString())
      console.log(dictArr, type)
      return dictNames ? dictNames.detailName : '-'
    }
  }
}