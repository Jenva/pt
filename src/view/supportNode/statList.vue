<template>
  <div class="support-psg-stat-list">
    <div class="search">
      <el-form :model="formData" ref="form" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点时间" prop="triggerTime" style="width: 100%s">
              <el-date-picker
                type="datetimerange"
                v-model="formData.triggerTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 90%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col :span="12">
            <el-form-item label="计划起飞时间" prop="planDepTime">
              <el-date-picker
                type="datetimerange"
                v-model="formData.planDepTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 90%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>   
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划到达时间" prop="planArrTime">
              <el-date-picker
                type="datetimerange"
                v-model="formData.planArrTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 90%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col :span="12">
            <el-form-item label="航班号" prop="flightNo">
              <el-input placeholder="请输入航班号" v-model="formData.flightNo" style="width: 90%">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点名称" prop="nodeType">
              <el-select placeholder="请输入节点名称" v-model="formData.nodeType" style="width: 90%">
                  <el-option :value="15" label="test"></el-option>
                  <el-option v-for="(node, key) in nodeList" :key="key" :value="node.detailValue" :label="node.detailName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="8">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableList" height="100%">
        <el-table-column label="航班号" prop="flight_no" align="center"></el-table-column>
        <el-table-column label="节点名称" prop="nodeType" align="center"></el-table-column>
        <el-table-column label="节点记录时间" prop="trigger_time" align="center"></el-table-column>
        <el-table-column label="计划起飞时间" prop="plan_dep_time" align="center"></el-table-column>
        <el-table-column label="计划到达时间" prop="plan_arr_time" align="center"></el-table-column>
        <el-table-column label="机位" prop="dep_loc" align="center"></el-table-column>
        <el-table-column label="机号" align="center" prop="craft_no"></el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import flightAPI from '@/api/flightAPI'
// import psgAPI from '@/api/psgAPI'
import commonAPI from '@/api/commonAPI'
import days from 'dayjs'
export default {
  data () {
    return {
      formData: {},
      nodeList: [],
      tableList: [],
      groupList: [],
      cameraList: [],
      currentFile: '',
      total: 0,
      offset: 0,
      limit: 10,
      showPic: false
    }
  },
  mounted () {
    this.getDict()
    // this.getGroupList()
    // this.getCameraList()
  },
  methods: {
    handleSizeChange (size) {
      this.limit = size
      this.search()
    },
    handleCurrentChange (page) {
      this.offset = 0
      this.offset = page - 1
      this.search()
    },
    downloadFile (id) {
      return commonAPI.downloadFile(id)
    },
    getCameraList () {
      commonAPI.getCameraList().then(res => {
        this.cameraList = res.data.payload
      })
    },
    getDict () {
      const params = {
        dictValue: 'AIRCRAFT_NODE'
      }
      commonAPI.getDictByValue(params).then(res => {
        this.nodeList = res.data.payload
        this.nodeList.reverse()
      })
    },
    getGroupList () {
      const params = {
        code: 'PSG'
        // type: 1
      }
      flightAPI.getByFlightStand(params).then(res => {
        this.groupList = res.data.payload
      })
    },
    showPicDialog (data) {
      this.showPic = true
      this.currentFile = this.downloadFile(data.file)
    },
    close () {
      this.showPic = false
    },
    search () {
      const params = Object.assign({}, this.formData)

      if (params.planDepTime) {
        params['planDepTime_gt'] = days(params.planDepTime[0]).format('YYYY-MM-DD HH:mm:ss')
        params['planDepTime_lt'] = days(params.planDepTime[1]).format('YYYY-MM-DD HH:mm:ss')
        delete params.planDepTime
      }
      if (params.triggerTime) {
        params['triggerTime_gt'] = days(params.triggerTime[0]).format('YYYY-MM-DD HH:mm:ss')
        params['triggerTime_lt'] = days(params.triggerTime[1]).format('YYYY-MM-DD HH:mm:ss')
        delete params.triggerTime
      }
      if (params.planArrTime) {
        params['planArrTime_gt'] = days(params.planArrTime[0]).format('YYYY-MM-DD HH:mm:ss')
        params['planArrTime_lt'] = days(params.planArrTime[1]).format('YYYY-MM-DD HH:mm:ss')
        delete params.planArrTime
      }
      this.getList(this.offset, this.limit, params)
    },
    reset () {
      this.$refs.form.resetFields()
    },
    getList (offset = 0, limit = 10, params) {
      flightAPI.queryListByParams(offset, limit, params).then(res => {
        res.data.payload.rows.forEach(item => {
          if (item.node_type) {
            const nodeType = this.nodeList.find(value => value.detailValue === item.node_type)
            item.nodeType = nodeType ? nodeType.detailName : '-'
          }
          if (item.plan_dep_time) {
            item.plan_dep_time = days(item.plan_dep_time).format('YYYY-MM-DD HH:mm:ss')
          }
          if (item.trigger_time) {
            item.trigger_time = days(item.trigger_time).format('YYYY-MM-DD HH:mm:ss')
          }
          if (item.plan_arr_time) {
            item.plan_arr_time = days(item.plan_arr_time).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        this.tableList = res.data.payload.rows
        this.total = res.data.payload.total
      })
    },
    playVideo (data) {
      const video = this.cameraList.find(item => item.name === data.cameraname)
      var startTime = days(data.collect_time).subtract(5, 'm').format('YYYY-MM-DD HH:mm:ss')
      var stopTime = days(data.collect_time).add(5, 'm').format('YYYY-MM-DD HH:mm:ss')
      var json = {
          type:1,
          domain: video && video.serverId,
          id:	video && video.code,
          level: 0,
          begin: startTime,
          end: stopTime
      }
      window.bykj && window.bykj.frameCall('popup', JSON.stringify(json)); 
    }
  }
}
</script>

<style lang="less" scoped>
#dark {
  .support-psg-stat-list {
    background: #21232d;
    .search {
      border: 1px solid #13585c;
      background: #1f2831;
    }
  }
}
#light {
  .support-psg-stat-list {
    background: #EBF2FA;
    .search {
      border: 1px solid #BCD0E3;
      background: #D7E9FA;
    }
  }
}
.support-psg-stat-list {
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
  // background: #21232d;
  .search {
    padding: 42px 20px 20px;
    // border: 1px solid #13585c;
    // background: #1f2831;
  }
  .table {
    height: calc(100% - 420px);
    margin-top: 50px;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
<style lang="less">
.support-psg-stat-list {
  .el-table .cell {
    font-size: 16Px;
    line-height: 1.5;
  }
  .el-table td, .el-table th {
    padding: 12Px 0
  } 
  .el-form-item__label,
  .el-button {
    font-size: 16Px;
  }
}
</style>