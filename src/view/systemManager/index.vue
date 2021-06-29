<template>
  <div id="system-manager">
    <div class="system-search">
      <span class="system-search-title">分组列表:</span>
      <el-select v-model="group" class="system-search-select" placeholder="请选择分组">
        <el-option value="1" label="五类车"></el-option>
      </el-select>
      <el-button type="primary" class="system-search-btn">获取分组</el-button>
    </div>
    <div class="system-add">
      <el-button type="primary" @click="showSideBar('addGroup')">创建分组</el-button>
    </div>
    <div class="system-table">
      <el-table :data="data" :loading="loading">
        <el-table-column align="center" type="expand">
          <template slot-scope="scope">
            <div class="three">
              <el-table :data="scope.row.children" :show-header="false">
                <el-table-column align="center" type="expand">
                  <template slot-scope="scope">
                    <div style="padding-left: 80px;">
                      <el-table :data="scope.row.children" :show-header="false">
                        <el-table-column label="所属分组" prop="name" align="center">
                        </el-table-column>
                        <el-table-column label="摄像机名称" prop="device" align="center"></el-table-column>
                        <el-table-column label="所属服务器" prop="server" align="center"></el-table-column>
                        <el-table-column label="操纵" align="center">
                          <template slot-scope="scope">
                            <el-button type="text" @click="showSideBar('editGroup', scope.row)">编辑分区</el-button>
                            <el-button type="text" @click="showSideBar('addAnalyse', scope.row)">添加分析</el-button>
                            <el-button type="text" @click="showSideBar('addCamera', scope.row)">绑定视频枪</el-button>
                            <el-button type="text" @click="deleteGroup(scope.row.id)">删除区域</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="所属分组" prop="name" align="center"></el-table-column>
                <el-table-column label="摄像机名称" prop="device" align="center"></el-table-column>
                <el-table-column label="所属服务器" prop="server" align="center"></el-table-column>
                <el-table-column label="操纵" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showSideBar('addGroup', scope.row)">添加分区</el-button>
                    <el-button type="text" @click="showSideBar('editGroup', scope.row)">编辑分区</el-button>
                    <el-button type="text" @click="showSideBar('addAnalyse', scope.row)">添加分析</el-button>
                    <el-button type="text" @click="showSideBar('addCamera', scope.row)">绑定视频枪</el-button>
                    <el-button type="text" @click="deleteGroup(scope.row.id)">删除区域</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属分组" prop="name" align="center"></el-table-column>
        <el-table-column label="摄像机名称" prop="device" align="center"></el-table-column>
        <el-table-column label="所属服务器" prop="server" align="center"></el-table-column>
        <el-table-column label="操纵" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showSideBar('editGroup', scope.row)">编辑</el-button>
            <el-button type="text" @click="showSideBar('addGroup', scope.row)">添加分区</el-button>
            <el-button type="text" @click="deleteGroup(scope.row.id)">删除分组</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-tree :data="data" :props="defaultProps"></el-tree> -->
    </div>
    <side-bar ref="sideBar" :title="title" @confirm="confirm">
      <el-form :model="formData" label-position="left">
        <el-form-item label="分组名称：" v-if="type.indexOf('Group') > 0">
          <el-input v-model="formData.name" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="功能名称：" v-else-if="type.indexOf('Analyse') > 0">
          <el-input v-model="formData.areaName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="设备选择：" v-if="type.indexOf('Group')  === -1">
          <el-select v-model="formData.code" style="width: 80%" filterable multiple>
            <el-option value="1" label="10.21.01"></el-option>
            <el-option value="2" label="11.24.01"></el-option>
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
      tableList: [
        { groupName: '五类车', gun: 111,  serve: '机场总服务器' }
      ],
      formData: {},
      list: [],
      id: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    showSideBar (type, data) {
      this.type = type
      this.title = type.indexOf('add') ? '新增' : '修改'
      if (type.indexOf('add') > -1) {
        this.id = data && data.id
      } else {
        this.formData = data
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
    confirm () {
      const params = {}
      if (this.type.indexOf('Group') > 0) {
        params.type = 0
        params.parentId = this.id || 0
      }
      if (this.type.indexOf('Area') > 0) {
        console.log(this.id)
        params.type = 1
        params.parentId = this.formData.id || this.id
      }
      if (this.formData.name) {
        params.name = this.formData.name
      }
      if (this.formData.code.length) {
        params.code = this.formData.code
      }
      groupAPI.addGroup(params).then(() => {
        this.getList()
      })
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
}
</style>

<style lang="less">
#system-manager {
  .el-table__expanded-cell[class*=cell] {
    padding: 0 0 0 30px!important;
  }
  
  .three {
    .el-table__expanded-cell[class*=cell] {
      border-top: 1px solid #13585c!important;
    }
  }

  // .el-table__row>td {
  //   border: none;
  // }
  .el-table__body-wrapper {
    .el-table td, .el-table th.is-leaf {
      border-bottom: none!important;;
    }
  }


  .el-table::before {
    height: 0px;
    background: rgba(0,0,0,0);
  }
}
</style>