import groupAPI from '@/api/groupAPI'

export default {
  data () {
    return {
      groupList: [],
      rootNodes: []
    }
  },
  created() {
    this.getGroupList()
  },
  mounted () {
  },
  // watch: {
  //   rootNodes (data) {
  //     console.log(data)
  //     this.insert(data)
  //   }
  // },
  methods: {
    getGroupList () {
      groupAPI.getGroupList().then(res => {
        const list = res.data.payload
        this.rootNodes = list.filter(item => !item.parentId)
        this.getTree(this.rootNodes, list)
        this.groupList = this.rootNodes
      })
    },
    getTree (data, list) {
      for (let i = 0; i < data.length; i++) {
        const rootNode = data[i]
        if (list.some(item => item.parentId === rootNode.id)) {
          rootNode.children = list.filter(item => item.parentId === rootNode.id)
          this.getTree(rootNode.children, list)
        }
      }
    }
    // insert (list) {
    //   for (let i = 0; i < list.length; i++) {
    //     const element = list[i]
    //     if (!element.children) this.$set(element, 'children', [])
    //     this.getCameraByGroupId(element.id, list[i])
    //     if (element.children.length) {
    //       this.insert(element.children)
    //     }
    //   }
    //   // console.log(list)
    // },
    // getCameraByGroupId (id, data) {
    //   const params = {
    //     groupId: id
    //   }
    //   groupAPI.cameraList(params).then(res => {
    //     // console.log(res)
    //     res.data.payload.forEach(item => {
    //       item.name = item.cameraName || '视频枪' + item.id
    //     })
    //     const cameraList = res.data.payload
    //     // for (let i = 0; i < cameraList.length; i++) {
    //     //   const element = cameraList[i]
    //     //   data.children.push(element)
    //     // }
    //     // const mergeArr = [].concat(data.children, cameraList)
    //     // const arr = []
    //     // mergeArr.forEach(item => {
    //     //   arr.unshift(item)
    //     // })
    //     // console.log([].concat(data.children, cameraList))
    //     // data.children = arr
    //     data.children.push(...cameraList)
    //       // this.$set(data, 'children', cameraList)
    //     // cameraList.forEach(item => {
    //     //   this.$set(data.children, data.children.length, item)
    //     // })
    //     // this.insertChildrenData(this.groupList, cameraList, id)
    //     console.log(data)
    //   })
    // }
  }
}