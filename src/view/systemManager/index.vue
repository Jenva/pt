<template>
  <div id="system-manager">
    <div class="system-search">
      <span class="system-search-title">分组列表:</span>
      <el-select v-model="group" class="system-search-select" placeholder="请选择分组">
        <el-option :value="item.code" :label="item.name" v-for="item in groupList" :key="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" class="system-search-btn" @click="search">获取分组</el-button>
    </div>
    <!-- <div class="system-add">
      <el-button type="primary" @click="showGroup('add')">创建分组</el-button>
    </div> -->
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
        @node-click="handleNodeClick"
        :default-expanded-keys="expandedKey"
      >
        <span class="system-cell-content" slot-scope="{ node, data }">
          <div class="system-first-cell">{{node.label}}</div>
          <div class="system-cell">{{node.label}}</div>
          <div class="system-cell">{{node.label}}</div>
          <div v-if="node.level === 1" class="system-cell">
            <el-button type="text" @click.stop="showGroup('edit', data)">编辑</el-button>
            <el-button type="text" @click.stop="showGroup('add', data, node.level)">添加分区</el-button>
            <!-- <el-button type="text" @click.stop="deleteGroup(data.id)">删除分组</el-button> -->
          </div>
          <div v-else-if="node.level === 2" class="system-cell">
            <el-button type="text" @click.stop="showGroup('add', data, node.level)">添加分区</el-button>
            <el-button type="text" @click.stop="showGroup('edit', data)">编辑分区</el-button>
            <el-popover
              placement="top"
              width="160"
              title="信息提示"
              v-model="deleteBtn[`delete${data.id}`]">
              <p style="text-align: center;font-size: 16px;">确定删除分组吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="deleteBtn[`delete${data.id}`] = false">取消</el-button>
                <el-button type="primary" size="mini" @click.stop="deleteGroup(data.id)">确定</el-button>
              </div>
              <el-button type="text" slot="reference">删除区域</el-button>
            </el-popover>
            <!-- <el-button type="text" @click.stop="deleteGroup(data.id)">删除区域</el-button> -->
          </div>
          <div v-else-if="node.level > 2" class="system-cell">
            <el-button type="text" @click.stop="showGroup('edit', data, node.level)">编辑分区</el-button>
            <el-button type="text" @click.stop="showAnalyse('add', data)">添加分析</el-button>
            <el-button type="text" @click.stop="showCamera('add', data)">绑定视频枪</el-button>
            <el-popover
              placement="top"
              width="160"
              title="信息提示"
              v-model="deleteBtn[`delete${data.id}`]">
              <p style="text-align: center;font-size: 16px;">确定删除分组吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="deleteBtn[`delete${data.id}`] = false">取消</el-button>
                <el-button type="primary" size="mini" @click.stop="deleteGroup(data.id)">确定</el-button>
              </div>
              <el-button type="text" slot="reference">删除区域</el-button>
            </el-popover>
            <!-- <el-button type="text" @click.stop="deleteGroup(data.id)">删除区域</el-button> -->
          </div>
        </span>
      </el-tree>
    </div>
    <side-bar ref="sideBar" :title="title" @confirm="confirm" @close="closeModal">
      <el-form :model="formData" label-position="left">
        <!-- <el-form-item label="分组名称：" v-if="type === 1">
          <el-input v-model="formData.name" style="width: 80%"></el-input>
        </el-form-item> -->
        <div v-if="type === 1">
          <el-form-item label="分组名称：" >
            <el-input v-model="formData.name" style="width: 80%"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分组编号：" v-if="handleType === 'add'">
            <el-input v-model="formData.code" style="width: 80%"></el-input>
          </el-form-item> -->
        </div>
        <!-- <el-form-item label="功能名称：" v-if="type === 2">
          <el-input v-model="formData.areaName" style="width: 80%"></el-input>
        </el-form-item> -->
        <div v-else>
          <el-form-item label="设备选择：">
            <el-select
              v-model="formData.cameraId" style="width: 80%"
              filterable v-if="type === 2" multiple value-key="code"
            >
              <el-option :value="info" :label="info.name" v-for="info in allCameraList" :key="info.id"></el-option>
            </el-select>
            <el-select v-model="formData.analsyCameraId" style="width: 80%" filterable v-else @change="changeAnalsy" value-key="id">
              <el-option :value="info" :label="info.cameraName" v-for="info in analsyCamera" :key="info.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="type === 2 ? '已绑定视频枪:' : '已分析视频枪:'">
            <el-tag v-for="camera in selectedCamera" :key="camera.id" style="margin-right: 5px;">{{camera.cameraName || '-'}}</el-tag>
          </el-form-item> -->
        </div>
      </el-form>
    </side-bar>
  </div>
</template>

<script>
import groupAPI from '@/api/groupAPI'
import commonAPI from '@/api/commonAPI'
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
      groupList: [],
      loading: false,
      level2: false,
      level3: false,
      handleType: '',
      tableList: [],
      formData: {
        cameraId: []
      },
      selectedCameraId: [],
      analsyCameraId: 0,
      analsyCamera: [],
      allCameraList: [],
      list: [],
      id: '',
      regions: [],
      expandedKey: [],
      groupType: '',
      deleteBtn: {},
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    selectedCamera () {
      if (this.type === 2) {
        return this.analsyCamera
      } else {
        return this.analsyCamera.filter(item => item.areaInfo)
      }
    }
  },
  mounted () {
    this.getList()
    this.frameRegister()
  },
  methods: {
    frameRegister () {
      const cxxNotifier = (cmd, data) => {
        console.log(data, cmd)
        if (cmd === 'saveregions') {
          this.regions = JSON.parse(data).regions
        }
      }
      window.bykj && window.bykj.frameRegister(cxxNotifier);
    },
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
    showGroup (type, data, level) {
      this.type = 1
      this.handleType= type
      if (type === 'edit') {
        this.formData = data
        this.title = '修改'
      } else {
        this.id = data && data.id
        this.formData.level = level ? level : 0
        this.title = '新增'
      }
      this.$refs.sideBar.showList()
    },
    showCamera (type, data) {
      this.type = 2
      this.handleType= type
      this.formData = data
      this.title = '绑定视频枪'
      this.getAlltCameraList()
      this.getCameraList(data.id)
      this.$nextTick(() => {
        this.$refs.sideBar.showList()
      })
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
      this.getCameraList(data.id)
      this.$refs.sideBar.showList()
    },
    getAlltCameraList () {
      commonAPI.getCameraList().then(res => {
        this.allCameraList = res.data.payload
      })
    },
    getCameraList (id) {
      const params = {
        groupId: id
      }
      groupAPI.getCameraListByGroupId(params).then(res => {
        res.data.payload.forEach(item => {
          item.name = item.cameraName
          item.code = item.cameraCode
        })
        this.analsyCamera = res.data.payload
        this.$set(this.formData, 'cameraId', res.data.payload)
      })
    },
    getList () {
      this.loading = true
      groupAPI.getGroupList().then(res => {
        this.list = res.data.payload
        let rootNodes = this.list.filter(item => !item.parentId)
        this.getTree(rootNodes)
        if (this.group) {
          rootNodes = rootNodes.filter(item => item.code === this.group)
        } else {
          this.groupList = rootNodes.filter(item => !item.parentId)
        }
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
        this.deleteBtn[`delete${id}`] = false
      })
    },
    closeModal () {
      this.formData = {}
    },
    handleGroup () {
      const params = {}
      params.name = this.formData.name
      if (this.handleType === 'add') {
        params.code = this.formData.code
        params.parentId = this.id || 0
        params.type = this.formData.level >= 2 ? 1 : 0
        groupAPI.addGroup(params).then(() => {
          this.getList()
        })
      } else {
        groupAPI.editGroup(this.formData.id, params).then(() => {
          this.getList()
        })
      }
    },
    handleNodeClick (data, node) {
      if (node.expanded) {
        this.expandedKey.push(node.key)
      } else {
        const index = this.expandedKey.indexOf(node.key)
        this.expandedKey.splice(index, 1)
      }
      if (node.level === 1) {
        this.groupType = data.code
        console.log(this.groupType)
      }
    },
    handleCamera () {
      const params = {}
      const camera = this.formData.cameraId.map(item => item.code)
      params.cameraCodes = camera
      if (this.handleType === 'add') {
        groupAPI.saveCamera(this.formData.id, camera).then(() => {
          this.getList()
        })
      }
    },
    changeAnalsy (data) {
      console.log(data)
      this.analsyCameraId = data.id
      const json = {
        playerid: 0,
        camera: {
          domain: data.serverId,
          id:	data.cameraCode
        },
        type: this.groupType === '0-CAR' ? 1 : 0,
        count: this.groupType === '0-CAR' ? 1 : 8,
        regions: (data.areaInfo && JSON.parse(data.areaInfo)) || []
      }
      this.regions = JSON.parse(data.areaInfo)
      window.bykj && window.bykj.frameCall('editregions', JSON.stringify(json))
    },
    handlerAnalsy () {
      groupAPI.updateCamera(this.analsyCameraId, {areaInfo: JSON.stringify(this.regions)}).then()
    },
    confirm (cb) {
      if (this.type === 1) {
        this.handleGroup()
        cb()
      } else if (this.type === 2) {
        this.handleCamera()
        cb()
      } else if (this.type === 3) {
        this.handlerAnalsy()
        cb()
      }
    }
  }
}
</script>

<style lang="less" scoped>
#dark {
  #system-manager {
    background: #21232d;
    .system-search-title {
      color: #fff;
    }
    .system-thead {
      color: #fff;
      background: #212330;
      border-bottom: 1px solid #13585c;
    }
  }
}
#light {
  #system-manager {
    background: #EBF2FA;
    .system-search-title {
      color: #2491F6;
    }
    .system-thead {
      color: #2491F6;
      background: #fff;
      border-bottom: 1px solid #BCD0E3;
    }
  }
}
#system-manager {
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow: auto;
  box-sizing: border-box;
  // background: #1f2831;
  .system-search {
    margin-bottom: 40px;
    .system-search-title {
      padding-right: 12px;
      font-size: 18px;
      // color: #fff;
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
    line-height: 40Px;
    // color: #fff;
    font-size: 16Px;
    // background: #212330;
    // border-bottom: 1px solid #13585c;
  }
  .system-cell-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .system-first-cell {
      width:23%;
      line-height: 40Px;
      text-align: center;
    }
    .system-cell {
      width:25%;
      line-height: 40Px;
      text-align: center;
    }
  }
}
</style>

<style lang="less">
#system-manager {
  #dark {
    .el-tree-node__content {
      border-bottom: 1px solid #13585c;
    }
    .el-tree-node__content:hover {
      background: rgba(43, 103, 116, 0.7);
    }
    .el-tree-node:focus>.el-tree-node__content {
      background: rgba(32,56,66,0.7)
    }
  }
  #light {
    .el-tree-node__content:hover {
      background: #BCD0E3;
    }
    .el-tree-node:focus>.el-tree-node__content {
      background: #2491F6
    }
  }
  .el-tree-node__content {
    height: 70Px;
    font-size: 16Px;
    // border-bottom: 1px solid #13585c;
  }
  .el-button {
    font-size: 16Px;
    font-family: '宋体';
  }
  // .el-tree-node__content:hover {
  //   background: rgba(43, 103, 116, 0.7);
  // }
  // .el-tree-node:focus>.el-tree-node__content {
  //   background: rgba(32,56,66,0.7)
  // }
}
</style>