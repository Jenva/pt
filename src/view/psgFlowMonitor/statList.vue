<template>
  <div class="psg-stat-list">
    <div class="search">
      <el-form :model="formData" ref="form">
        <el-row>
          <el-col :span="10">
            <el-form-item label="触发时间" prop="createTime">
              <el-date-picker
                type="datetimerange"
                v-model="formData.createTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 75%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col :span="6">
            <el-form-item label="区域" prop="groupId">
              <el-select placeholder="请选择区域" v-model="formData.groupId">
                <el-option :value="group.id" :label="group.name" v-for="group in groupList" :key="group.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableList" border height="100%">
        <el-table-column label="区域" prop="groupname" align="center"></el-table-column>
        <el-table-column label="视频枪" prop="cameraname" align="center"></el-table-column>
        <el-table-column label="统计时段" prop="collect_time" align="center"></el-table-column>
        <el-table-column label="客流量" prop="passenger_count" align="center"></el-table-column>
        <el-table-column label="视频回放" prop="review" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="playVideo(scope.row)">
              历史视频
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="热力截图" prop="heatMap" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="showPicDialog(scope.row)">
              热力图
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="告警指标" align="center" prop="remark"></el-table-column>
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
    <el-dialog
      title="热力图"
      :visible="showPic"
      @close="close"
      width="80%"
    >
      <div class="imgPreview">
        <img :src="currentFile" alt="" class="img">
      </div>
    </el-dialog>
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
    getChildrenNode (id, groups) {
      groups.push(id)
      const children = this.groupList.filter(item => item.parentId === id)
      children.forEach(item => {
        this.getChildrenNode(item.id, groups)
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
    getHeight () {
      return 
    },
    search () {
      const params = {}
      const { createTime, groupId } = this.formData
      if (groupId) {
        const groupIds = []
        this.getChildrenNode(groupId, groupIds)
        params.groupIdList = groupIds.join(',')
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
  box-sizing: border-box;
  overflow: hidden;
  background: #21232d;
  .search {
    padding: 42px 20px 20px;
    border: 1px solid #13585c;
    background: #1f2831;
  }
  .table {
    height: calc(100% - 280px);
    margin-top: 50px;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
  .imgPreview {
    width: 100%;
    height: 100%;
    text-align: center;
    // overflow: auto;
  }
  .img {
    width: 100%;
    height: 100%;
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
  .el-dialog {
    height: calc(100% - 60Px);
    margin-top: 10Px!important;
  }
  .el-dialog__body {
    height: calc(100% - 115px);
  }
}
</style>