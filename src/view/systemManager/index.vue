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
      <el-table :data="tableList">
        <el-table-column align="center" type="expand">
          <template slot-scope>
            <div class="three">
              <el-table :data="tableList" :show-header="false">
                <el-table-column align="center" type="expand">
                  <template slot-scope>
                    <div style="padding-left: 80px;">
                      <el-table :data="tableList" :show-header="false">
                        <el-table-column label="所属分组" prop="groupName" align="center">
                          <template>
                            <span>试试</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="摄像机名称" prop="gun" align="center"></el-table-column>
                        <el-table-column label="所属服务器" prop="serve" align="center"></el-table-column>
                        <el-table-column label="操纵" align="center">
                          <template slot-scope="scope">
                            <el-button type="text" @click="showSideBar('editArea', scope.row)">编辑分区</el-button>
                            <el-button type="text" @click="showSideBar('addAnalyse', scope.row)">添加分析</el-button>
                            <el-button type="text">删除区域</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="所属分组" prop="groupName" align="center"></el-table-column>
                <el-table-column label="摄像机名称" prop="gun" align="center"></el-table-column>
                <el-table-column label="所属服务器" prop="serve" align="center"></el-table-column>
                <el-table-column label="操纵" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" @click="showSideBar('editArea', scope.row)">编辑分区</el-button>
                    <el-button type="text" @click="showSideBar('addAnalyse', scope.row)">添加分析</el-button>
                    <el-button type="text">删除区域</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属分组" prop="groupName" align="center"></el-table-column>
        <el-table-column label="摄像机名称" prop="gun" align="center"></el-table-column>
        <el-table-column label="所属服务器" prop="serve" align="center"></el-table-column>
        <el-table-column label="操纵" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showSideBar('editGroup', scope.row)">编辑</el-button>
            <el-button type="text" @click="showSideBar('addArea')">添加分区</el-button>
            <el-button type="text">删除分组</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-tree :data="data" :props="defaultProps"></el-tree> -->
    </div>
    <side-bar ref="sideBar" :title="title">
      <el-form :model="formData" label-position="left">
        <el-form-item label="分组名称：" v-if="type.indexOf('Group') > 0">
          <el-input v-model="formData.groupName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="区域名称：" v-else-if="type.indexOf('Area') > 0">
          <el-input v-model="formData.areaName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="功能名称：" v-else-if="type.indexOf('Analyse') > 0">
          <el-input v-model="formData.areaName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="设备选择：" v-if="type.indexOf('Group')  === -1">
          <el-select v-model="formData.device" style="width: 80%" filterable multiple>
            <el-option value="1" label="10.21.01"></el-option>
            <el-option value="2" label="11.24.01"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </side-bar>
  </div>
</template>

<script>
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
      tableList: [
        { groupName: '五类车', gun: 111,  serve: '机场总服务器' }
      ],
      formData: {},
      data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    showSideBar (type, data) {
      this.type = type
      this.title = type.indexOf('add') > -1 ? '新增' : '修改'
      this.formData = data || {}
      this.$refs.sideBar.showList()
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