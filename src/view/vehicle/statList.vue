<template>
  <div class="stat-list">
    <div class="search">
      <el-form :model="formData" inline>
        <el-row>
          <el-col :span="7">
            <el-form-item label="时间范围">
              <el-date-picker type="datetimerange" v-model="formData.createTime" style="width: 80%"></el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col :span="6">
            <el-form-item label="区域">
              <el-select placeholder="请选择区域" v-model="formData.Type">
                <el-option :value="group.id" :label="group.name" v-for="group in grouplist" :key="group.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="五类车类型">
              <el-select placeholder="请选择五类车类型" v-model="formData.cartype">
                <el-option :value="type.detailValue" :label="type.detailName" v-for="type in carTypeDict" :key="type.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button>清除数据</el-button>
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableList" border>
        <el-table-column label="区域" prop="groupName" align="center"></el-table-column>
        <el-table-column label="统计时段" prop="time" align="center">
          <template>
            <span>
              {{startTime}}-{{endTime}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" prop="cartype" align="center"></el-table-column>
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
  </div>
</template>

<script>
import days from 'dayjs'
import vehicleAPI from '@/api/vehicleAPI'
import groupAPI from '@/api/groupAPI'
import commonAPI from '@/api/commonAPI'
export default {
  data () {
    return {
      total: 50,
      grouplist: [],
      carTypeDict: [],
      startTime: '',
      endTime: '',
      formData: {
        createTime: [],
      },
      tableList: [
        { area: 't1', time: '2010-10-10 20:20:20', vehicleType: '汽车', vehicleIn: 1, vehicleOut: 2, review: 1 }
      ]
    }
  },
  created () {
    this.getGroupList()
  },
  mounted () {
    this.getDict('CAR_TYPE', 'carTypeDict')
    this.getList()
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    getList (params) {
      // const params = {
      //   createTime_gt: '2021-05-01 00:00:00',
      //   createTime_lt: '2021-07-17 00:00:00'
      // }
      vehicleAPI.statListByLimitTime(params).then(res => {
        const list = res.data.payload
        const tableList = []
        list.forEach(item => {
          const groupName = this.grouplist.find(item => item.id === item.group_id)
          item.groupName = groupName ? groupName.name : '-'
          const data = tableList.find(value => value['group_id'] === item['group_id'] && value.cartype === item.cartype)
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
      groupAPI.getGroupList(params).then(res => {
        this.grouplist = res.data.payload
      })
    },
    search () {
      const params = Object.assign({}, this.formData)
      if (params.createTime[0]) {
        params['createTime_gt'] = days(params.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        params['createTime_lt'] = days(params.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
        this.startTime = params.createTime_gt
        this.endTime = params.createTime_lt
        delete params.createTime
      }
      this.getList(params)
    },
    getDict (value, name) {
      const params = {
        dictValue: value
      }
      commonAPI.getDictByValue(params).then(res => {
        this[name] = res.data.payload
      })
    },
    getCameraInfo (id, cb) {
      const params = {
        groupId: id
      }
      groupAPI.getCameraListByGroupId(params).then((res) => {
        cb(res.data.payload)
      })
    },
    playVideo (data) {
      this.getCameraInfo(data.group_id, (data) => {
        // var cur = new Date()
        var startTime = days(this.formData.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        var stopTime = days(this.formData.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
        // var startTime = days(cur).subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss')
        // var stopTime = days(cur).format('YYYY-MM-DD HH:mm:ss')
        var json={
            type: 1,
            domain: data[0].serverId || "YFGZHOM1.A1",
            id:	data[0].cameraCode || "000002X0000",
            level: 0,
            begin:startTime,
            end:stopTime
        }
        window.bykj && window.bykj.frameCall('popup', JSON.stringify(json)); 
      })
    }
  }
}
</script>

<style lang="less" scoped>
.stat-list {
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