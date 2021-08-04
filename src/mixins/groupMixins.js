import groupAPI from '@/api/groupAPI'
import taskAPI from '@/api/taskAPI'

export default {
  data () {
    return {
      groupList: [],
      rootNodes: []
    }
  },
  created() {
    this.getData()
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
    getData () {
      const params = {
        taskType: this.taskType
      }
      const promises = [groupAPI.getGroupList(), taskAPI.getTaskPageList(0, 100, params)]
      Promise.all(promises).then(res => {
        const taskList = res[1].data.payload.rows
        taskList.forEach(item => {
          item.parentId = item.groupId
          item.id = item.id.toString()
        })
        const list = res[0].data.payload.concat(taskList)
        this.rootNodes = list.filter(item => !item.parentId)
        this.getTree(this.rootNodes, list)
        this.groupList = this.rootNodes.filter(item => item.code === this.type)
      })
    },
    getGroupList () {
      // const params = {
      //   code: this.type
      // }
      groupAPI.getGroupList().then(res => {
        const list = res.data.payload
        this.rootNodes = list.filter(item => !item.parentId)
        this.getTree(this.rootNodes, list)
        this.groupList = this.rootNodes.filter(item => item.code === this.type)
      })
    },
    getTree (data, list) {
      for (let i = 0; i < data.length; i++) {
        const rootNode = data[i]
        if (list.some(item => item.parentId === rootNode.id || item.parentId === rootNode.groupId)) {
          rootNode.children = list.filter(item => item.parentId === rootNode.id)
          this.getTree(rootNode.children, list)
        }
      }
    }
  }
}