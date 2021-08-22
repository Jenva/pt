<template>
  <div class="stat-list">
    <div class="search">
      <el-form :model="formData" inline ref="form">
        <el-row>
          <el-col :span="9">
            <el-form-item label="时间范围" prop="createTime">
              <el-date-picker type="datetimerange" v-model="formData.createTime" style="width: 85%"></el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col :span="5">
            <el-form-item label="区域" prop="groupId">
              <el-select placeholder="请选择区域" v-model="formData.groupId">
                <el-option :value="group.id" :label="group.name" v-for="group in grouplist" :key="group.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="五类车类型" prop="carType">
              <el-select placeholder="请选择五类车类型" v-model="formData.carType">
                <el-option :value="type.detailValue" :label="type.detailName" v-for="type in carTypeDict" :key="type.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button @click="reset">清除数据</el-button>
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="toggle" v-if="!isVideoList">
      <span :class="['el-icon-tickets', 'span', name === 'table' ? 'selected' : '']" @click="changeName('table')">
      </span>
      <span :class="['el-icon-menu', 'span', name === 'pic' ? 'selected' : '']" @click="changeName('pic')">
      </span>
    </div>
    <div v-if="isVideoList">
      <vehicle-video-list ref="videoList" :carTypeDict="carTypeDict"></vehicle-video-list>
    </div>
    <div v-else>
      <vehicle-pic-list v-show="name === 'pic'" ref="picList" :carTypeDict="carTypeDict"></vehicle-pic-list>
      <vehicle-table ref="tableList" :carTypeDict="carTypeDict" v-show="name === 'table'"></vehicle-table>
    </div>
    <!-- <div class="table">
      <el-table :data="tableList" border>
        <el-table-column label="区域" prop="name" align="center"></el-table-column>
        <el-table-column label="统计时段" prop="time" align="center">
          <template>
            <span>
              {{startTime}}-{{endTime}}
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
    </div> -->
  </div>
</template>

<script>
import days from 'dayjs'
import vehicleAPI from '@/api/vehicleAPI'
import groupAPI from '@/api/groupAPI'
import commonAPI from '@/api/commonAPI'
import vehiclePicList from './vehiclePicList'
import vehicleTable from './vehicleTable'
import vehicleVideoList from './vehicleVideoList'
export default {
  components: {
    vehiclePicList,
    vehicleTable,
    vehicleVideoList
  },
  data () {
    return {
      grouplist: [],
      carTypeDict: [],
      startTime: '',
      endTime: '',
      name: 'table',
      formData: {
        createTime: [],
      },
      tableList: [
        { area: 't1', time: '2010-10-10 20:20:20', vehicleType: '汽车', vehicleIn: 1, vehicleOut: 2, review: 1 }
      ]
    }
  },
  watch: {
    tableList () {
      // data.forEach(item => {
      //   this.getCameraInfo(data.group_id, (payload) => {
      //     data
      //   })
      // })
    }
  },
  computed: {
    isVideoList () {
      return this.$route.path === '/vehicleVideoList'
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
    changeName (name) {
      this.name = name
      this.$nextTick(() => {
        this.search()
      })
    },
    reset () {
      this.$refs.form.resetFields()
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
          // const groupName = this.grouplist.find(value => value.id === item.group_id)
          // item.groupName = groupName ? groupName.name : '-'
          const data = tableList.find(value => value['group_id'] === item['group_id'] && value.cartype === item.cartype)
          if (item.cartype > -1) {
            const types = this.carTypeDict.find(value => parseInt(value.detailValue) === item.cartype)
            item.carTypeDisplay =  types ? types.detailName : '-'
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
    search () {
      const params = Object.assign({}, this.formData)
      if (params.createTime[0]) {
        params['createTime_gt'] = days(params.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        params['createTime_lt'] = days(params.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
        delete params.createTime
      }
      if (this.isVideoList) {
        this.$refs.videoList.getList(params)
      } else {
        if (this.name === 'pic') {
          this.$refs.picList.getPicList(params)
        } else {
          this.$refs.tableList.getList(params)
        }
      }
    },
    getDict (value, name) {
      const params = {
        dictValue: value
      }
      commonAPI.getDictByValue(params).then(res => {
        this[name] = res.data.payload
      })
    },
  }
}
</script>

<style lang="less" scoped>
.stat-list {
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
  .toggle {
    width: 100%;
    margin: 20px 0 0;
    .selected.span {
      color: #209399;
      background: rgba(19, 154, 163, 0.5);
    }
    span {
      display: inline-block;
      width: 20Px;
      height: 20Px;
      padding: 5Px 10Px;
      font-size: 20Px;
      color: #fff;
      border: 1px solid #209399;
      cursor: pointer;
    }
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