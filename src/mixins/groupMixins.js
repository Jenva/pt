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
        if (list.some(item => item.parentId === rootNode.id)) {
          rootNode.children = list.filter(item => item.parentId === rootNode.id)
          this.getTree(rootNode.children, list)
        }
      }
    }
  }
}