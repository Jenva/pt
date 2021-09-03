<template>
    <div class="table">
      <el-table :data="tableList" border>
        <el-table-column label="区域" prop="name" align="center"></el-table-column>
        <el-table-column label="视频枪" prop="camera_name" align="center"></el-table-column>
        <el-table-column label="统计时段" prop="time" align="center" width="350px">
          <template>
            <span>
              {{startTime}} - {{endTime}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" prop="carTypeDisplay" align="center"></el-table-column>
        <el-table-column label="车辆进入" prop="0-count" align="center"></el-table-column>
        <el-table-column label="车辆离开" prop="1-count" align="center"></el-table-column>
        <el-table-column label="视频回放" align="center" prop="review">
          <template slot-scope="scope">
            <el-button size="mini" @click="playVideo(scope.row)">
              <img src="../../assets/vehiclemanagement_icon_historicversion_normal.png" alt="" style="vertical-align: middle">
              历史视频
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div> -->
    </div>
</template>

<script>
import days from 'dayjs'
import vehicleAPI from '@/api/vehicleAPI'
import groupAPI from '@/api/groupAPI'
import commonAPI from '@/api/commonAPI'
export default {
  props: {
    carTypeDict: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      total: 50,
      grouplist: [],
      startTime: '',
      endTime: '',
      tableList: [
        { area: 't1', time: '2010-10-10 20:20:20', vehicleType: '汽车', vehicleIn: 1, vehicleOut: 2, review: 1 }
      ]
    }
  },
  created () {
    this.getGroupList()
  },
  mounted () {
    this.getCameraList()
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    getList (params = {}) {
      this.startTime = params.createTime_gt
      this.endTime = params.createTime_lt
      vehicleAPI.statListByCameraLimitTime(params).then(res => {
        const list = res.data.payload
        const tableList = []
        list.forEach(item => {
          const groupName = this.grouplist.find(value => value.id === item.group_id)
          item.groupName = groupName ? groupName.name : '-'
          const data = tableList.find(value => value['group_id'] === item['group_id'] && value.cartype === item.cartype)
          if (item.cartype > -1) {
            const types = this.carTypeDict.find(value => parseInt(value.detailValue) === item.cartype)
            item.carTypeDisplay =  types ? types.detailName : '-'
          }
          if (item.camera_code) {
            const camera = this.cameraList.find(value => value.code === item.camera_code)
            console.log(this.cameraList)
            item.camera = camera
          }
          if (data) {
            data[`${item.status}-count`] = item.count
          } else {
            item[`${item.status}-count`] = item.count
            tableList.push(item)
          }
        })
        this.tableList = tableList
      })
    },
    getGroupList () {
      const params = {
        code: '0-CAR',
        // parentId: 3
      }
      groupAPI.listSonByParent(params).then(res => {
        this.grouplist = res.data.payload
      })
    },
    getCameraList () {
      commonAPI.getCameraList().then(res => {
        this.cameraList = res.data.payload
      })
    },
    playVideo (data) {
      if (data.camera) {
        // var cur = new Date()
        var startTime = days(this.startTime).format('YYYY-MM-DD HH:mm:ss')
        var stopTime = days(this.endTime).format('YYYY-MM-DD HH:mm:ss')
        // var startTime = days(cur).subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss')
        // var stopTime = days(cur).format('YYYY-MM-DD HH:mm:ss')
        var json={
            type: 1,
            domain: data.camera.serverId,
            id:	data.camera.code,
            level: 0,
            begin:startTime,
            end:stopTime
        }
        window.bykj && window.bykj.frameCall('popup', JSON.stringify(json)); 
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .table {
    height: calc(100% - 210px);
    overflow: auto;
    margin-top: 30px;
  }
</style>
<style lang="less">
.stat-list {
  .el-table .cell {
    font-size: 16Px;
    line-height: 1.5;
  }
  .el-table td, .el-table th {
    padding: 12Px 0
  }
  .el-form-item__label {
    font-size: 16Px;
  }
}
</style>