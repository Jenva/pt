<template>
  <div class="psg-stat-list">
    <div class="search">
      <el-form :model="formData" ref="form" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点时间" prop="createTime" style="width: 100%s">
              <el-date-picker
                type="datetimerange"
                v-model="formData.createTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 90%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col :span="12">
            <el-form-item label="计划起飞时间" prop="createTime">
              <el-date-picker
                type="datetimerange"
                v-model="formData.createTime"
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
            <el-form-item label="计划到达时间" prop="createTime">
              <el-date-picker
                type="datetimerange"
                v-model="formData.createTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 90%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col :span="12">
            <el-form-item label="航班号" prop="groupId">
              <el-input placeholder="请输入航班号" v-model="formData.groupId" style="width: 90%">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="节点名称" prop="groupId">
              <el-select placeholder="请输入节点名称" v-model="formData.groupId" style="width: 90%">
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" :offset="9">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableList">
        <el-table-column label="航班号" prop="flightCode" align="center"></el-table-column>
        <el-table-column label="节点名称" prop="nodeName" align="center"></el-table-column>
        <el-table-column label="节点记录时间" prop="nodeTime" align="center"></el-table-column>
        <el-table-column label="计划起飞时间" prop="offTime" align="center"></el-table-column>
        <el-table-column label="计划到达时间" prop="onTime" align="center"></el-table-column>
        <el-table-column label="机位" prop="position" align="center"></el-table-column>
        <el-table-column label="机号" align="center" prop="num"></el-table-column>
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
import groupAPI from '@/api/groupAPI'
import psgAPI from '@/api/psgAPI'
import commonAPI from '@/api/commonAPI'
import days from 'dayjs'
export default {
  data () {
    return {
      formData: {},
      tableList: [
        {
          flightCode: 'CZ4389',
          nodeName: '摆渡车到位',
          nodeTime: '2021-08-03 14:05:24',
          offTime: '2021-08-03 15:38:13',
          onTime: '2021-08-03 23:51:29',
          position: 'A14',
          num: 'B-753'
        },
        {
          flightCode: 'CZ4389',
          nodeName: '摆渡车到位',
          nodeTime: '2021-08-03 14:05:24',
          offTime: '2021-08-03 15:38:13',
          onTime: '2021-08-03 23:51:29',
          position: 'A14',
          num: 'B-753'
        },
        {
          flightCode: 'CZ4389',
          nodeName: '摆渡车到位',
          nodeTime: '2021-08-03 14:05:24',
          offTime: '2021-08-03 15:38:13',
          onTime: '2021-08-03 23:51:29',
          position: 'A14',
          num: 'B-753'
        }
      ],
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
    this.getGroupList()
    this.getCameraList()
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
    getGroupList () {
      const params = {
        code: 'PSG'
        // type: 1
      }
      groupAPI.listSonByParent(params).then(res => {
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
      const params = {}
      const { createTime, groupId } = this.formData
      if (groupId) {
        params.groupId = groupId
      }
      if (createTime) {
        params['createTime_gt'] = days(createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        params['createTime_lt'] = days(createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      this.getList(this.offset, this.limit, params)
    },
    reset () {
      this.$refs.form.resetFields()
    },
    getList (offset = 0, limit = 10, params) {
      psgAPI.queryListByParams(offset, limit, params).then(res => {
        res.data.payload.rows.forEach(item => {
          if (item.area_info) {
            item.value = JSON.parse(item.area_info)[0].value
          }
          if (item.collect_time) {
            item.collect_time = days(item.collect_time).format('YYYY-MM-DD HH:mm:ss')
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
.psg-stat-list {
  height: 100%;
  padding: 24px;
  background: #21232d;
  .search {
    padding: 42px 20px 20px;
    border: 1px solid #13585c;
    background: #1f2831;
  }
  .table {
    margin-top: 50px;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
<style lang="less">
.psg-stat-list {
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