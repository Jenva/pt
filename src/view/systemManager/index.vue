<template>
  <div id="system-manager">
    <div class="system-search">
      <span class="system-search-title">分组列表:</span>
      <el-select v-model="group" class="system-search-select" placeholder="请选择分组">
        <el-option value="1" label="五类车"></el-option>
      </el-select>
      <el-button type="primary" class="system-search-btn" @click="search">获取分组</el-button>
    </div>
    <div class="system-add">
      <el-button type="primary" @click="showGroup('add')">创建分组</el-button>
    </div>
    <div class="system-table">
      <table class="system-thead">
          <colgroup>
            <col width="25%">
            <col width="25%">
            <col width="25%">
            <col width="25%">
          </colgroup>
        <thead>
          <tr>
            <th>所属分组</th>
            <th>摄像机名称</th>
            <th>所属服务器</th>
            <th>操作</th>
          </tr>
        </thead>
      </table>
      <el-tree
        :data="data"
        node-key="id"
        :props="defaultProps"
      >
        <span class="system-cell-content" slot-scope="{ node, data }">
          <div class="system-first-cell">{{node.label}}</div>
          <div class="system-cell">{{node.label}}</div>
          <div class="system-cell">{{node.label}}</div>
          <div v-if="node.level === 1" class="system-cell">
            <el-button type="text" @click.stop="showGroup('edit', data)">编辑</el-button>
            <el-button type="text" @click.stop="showGroup('add', data)">添加分区</el-button>
            <el-button type="text" @click.stop="deleteGroup(data.id)">删除分组</el-button>
          </div>
          <div v-else-if="node.level === 2" class="system-cell">
            <el-button type="text" @click.stop="showGroup('add', data)">添加分区</el-button>
            <el-button type="text" @click.stop="showGroup('edit', data)">编辑分区</el-button>
            <el-button type="text" @click.stop="showAnalyse('add', data)">添加分析</el-button>
            <el-button type="text" @click.stop="showCamera('add', data)">绑定视频枪</el-button>
            <el-button type="text" @click.stop="deleteGroup(data.id)">删除区域</el-button>
          </div>
          <div v-else-if="node.level > 2" class="system-cell">
            <el-button type="text" @click.stop="showGroup('edit', data)">编辑分区</el-button>
            <el-button type="text" @click.stop="showAnalyse('add', data)">添加分析</el-button>
            <el-button type="text" @click.stop="showCamera('add', data)">绑定视频枪</el-button>
            <el-button type="text" @click.stop="deleteGroup(data.id)">删除区域</el-button>
          </div>
        </span>
      </el-tree>
    </div>
    <side-bar ref="sideBar" :title="title" @confirm="confirm" @close="closeModal">
      <el-form :model="formData" label-position="left">
        <el-form-item label="分组名称：" v-if="type === 1">
          <el-input v-model="formData.name" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="功能名称：" v-if="type > 2">
          <el-input v-model="formData.areaName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="设备选择：" v-if="type > 1">
          <el-select v-model="formData.cameraInfo" style="width: 80%" filterable multiple>
            <el-option :value="info.id" :label="info.cameraName" v-for="info in camera" :key="info.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </side-bar>
  </div>
</template>

<script>
import groupAPI from '@/api/groupAPI'
import sideBar from '@/components/sideBar'
export default {
  components: {
    sideBar
  },
  data () {
    return {
      group: '',
      title: '',
      type: '',
      loading: false,
      handleType: '',
      tableList: [
        { groupName: '五类车', gun: 111,  serve: '机场总服务器' }
      ],
      camera: [
        { cameraName: '10.21.01', id: 1 },
        { cameraName: '10.24.01', id: 2 }
      ],
      formData: {},
      list: [],
      id: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    search () {
      this.getList()
    },
    showSideBar (type, data) {
      this.type = type
      this.title = type.indexOf('add') > -1 ? '新增' : '修改'
      if (type === 'edit') {
        this.formData = data
      } else {
        this.id = data && data.id
      }
      this.$refs.sideBar.showList()
    },
    showGroup (type, data) {
      this.type = 1
      this.handleType= type
      if (type === 'edit') {
        this.formData = data
        this.title = '修改'
      } else {
        this.id = data && data.id
        this.title = '新增'
      }
      this.$refs.sideBar.showList()
    },
    showCamera (type, data) {
      this.type = 2
      this.handleType= type
      if (type === 'edit') {
        this.title = '修改'
        this.formData = data
      } else {
        this.id = data && data.id
        this.title = '新增'
      }
      this.$refs.sideBar.showList()
    },
    showAnalyse (type, data) {
      this.type = 3
      this.handleType= type
      if (type === 'edit') {
        this.title = '修改'
        this.formData = data
      } else {
        this.id = data && data.id
        this.title = '新增'
      }
      this.$refs.sideBar.showList()
    },
    getList () {
      this.loading = true
      groupAPI.getGroupList().then(res => {
        this.list = res.data.payload
        const rootNodes = this.list.filter(item => !item.parentId)
        this.getTree(rootNodes)
        this.data = rootNodes
        this.loading = false
      })
    },
    getTree (data) {
      for (let i = 0; i < data.length; i++) {
        const rootNode = data[i]
        if (this.list.some(item => item.parentId === rootNode.id)) {
          rootNode.children = this.list.filter(item => item.parentId === rootNode.id)
          this.getTree(rootNode.children)
        }
      }
    },
    deleteGroup (id) {
      groupAPI.deleteGroup(id).then(() => {
        this.getList()
      })
    },
    closeModal () {
      this.formData = {}
    },
    handleGroup () {
      const params = {}
      params.name = this.formData.name
      if (this.handleType === 'add') {
        params.type = this.id ? 1 : 0
        params.parentId = this.id || 0
        groupAPI.addGroup(params).then(() => {
          this.getList()
        })
      } else {
        groupAPI.editGroup(this.formData.id, params).then(() => {
          this.getList()
        })
      }
    },
    handleCamera () {
      const params = {}
      const cameraList = this.camera
      .filter(item => this.formData.cameraInfo.includes(item.id))
      .map(item => {
        return {
          cameraId: item.id,
          cameraName: item.cameraName,
          groupId: this.id
        }
      })
      if (this.handleType === 'add') {
        params.parentId = this.formData.id || 0
        groupAPI.saveCamera(cameraList).then(() => {
          this.getList()
        })
      }
    },
    confirm () {
      if (this.type === 1) {
        this.handleGroup()
      } else if (this.type === 2) {
        this.handleCamera()
      }
    }
  }
}
</script>

<style lang="less" scoped>
#system-manager {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  background: #1f2831;
  .system-search {
    .system-search-title {
      padding-right: 12px;
      font-size: 18px;
      color: #fff;
    }
    .system-search-select {
      width: 326px;
    }
    .system-search-btn {
      margin-left: 12px;
    }
  }
  .system-add {
    margin: 24px 0 18px;
  }
  .system-thead {
    width: 100%;
    line-height: 40px;
    color: #fff;
    background: #212330;
    border-bottom: 1px solid #13585c;
  }
  .system-cell-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .system-first-cell {
      width:23%;
      line-height: 40px;
      text-align: center;
    }
    .system-cell {
      width:25%;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>

<style lang="less">
#system-manager {
  .el-tree-node__content {
    height: 70px;
    border-bottom: 1px solid #13585c;
  }
  .el-tree-node__content:hover,
  .el-tree-node:focus>.el-tree-node__content {
    background: rgb(64, 64, 65);
  }
}
</style>