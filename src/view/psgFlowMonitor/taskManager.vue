<template>
  <div class="task-manager">
    <div class="task-add">
      <el-button size="samll" type="primary" icon="el-icon-plus" @click="showModal('add')">新增任务</el-button>
    </div>
    <div class="task-table">
      <el-table :data="tableList">
        <el-table-column label="任务名" prop="name" align="center"></el-table-column>
        <el-table-column label="区域" prop="groupName" align="center"></el-table-column>
        <el-table-column label="采集频率" prop="rate" align="center"></el-table-column>
        <el-table-column label="摄像机" prop="gun" align="center"></el-table-column>
        <el-table-column label="启动时间" prop="triggerTime" align="center"></el-table-column>
        <el-table-column label="告警指标" prop="alarm" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="showModal('edit', scope.row)">
                <img src="../../assets/passengerflowmanagement_icon_edit_normal.png" alt="" style="vertical-align: middle">
                编辑
              </el-button>
              <el-button type="text" @click="bootTask(scope.row.id)">
                <img src="../../assets/passengerflowmanagement_icon_suspend_normal.png" alt="" style="vertical-align: middle">
                启动
              </el-button>
            </div>
          </template>
        </el-table-column>
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
    <sideBar ref="sideBar" :title="title" @close="closedModal" @confirm="confirm">
      <div class="form">
        <el-form :model="formData" label-width="100px">
          <el-form-item label="任务名:">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="区域:">
            <el-select v-model="formData.groupId">
              <el-option :value="item.id" :label="item.name" v-for="item in groupList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启动方式:">
            <el-radio-group v-model="formData.bootType">
              <el-radio :label="type.detailValue" v-for="type in bootTypeDict" :key="type.id">{{ type.detailName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="触发时间:">
            <el-time-picker
              v-model="formData.triggerTime"
              :picker-options="{
                selectableRange: '00:00:00 - 23:59:59'
              }"
              placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="任务时长:">
            <el-input v-model="formData.taskTime"></el-input>
          </el-form-item>
          <el-form-item label="摄像机:">
            <el-select v-model="formData.cameraCodes" multiple="">
              <el-option :value="camera.code" :label="camera.name" v-for="camera in cameraList" :key="camera.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集频率:">
            <el-select v-model="formData.rate">
              <el-option value="1" label="10分钟" key="1"></el-option>
              <el-option value="2" label="20分钟" key="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警指标:">
            <el-input v-model="formData.alarm"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sideBar>
  </div>
</template>

<script>
import sideBar from '@/components/sideBar'
import taskAPI from '@/api/taskAPI'
import groupAPI from '@/api/groupAPI'
import commonAPI from '@/api/commonAPI'
import dayjs from 'dayjs'
export default {
  components: {
    sideBar
  },
  data () {
    return {
      tableList: [
        { name: '任务1', area: '西三指廊', rate: '10分钟', gun: '1.108.20.3', startTime: '2021-04-23 09:00:00', warningCount: '999' }
      ],
      groupList: [],
      bootTypeDict: [],
      type: '',
      total: 40,
      limit: 10,
      title: '',
      cameraList: [],
      formData: {
        triggerTime: '00:01:00',
        cameraCodes: []
      }
    }
  },
  created () {
    this.getDict()
    this.getCameraList()
    this.getGroup()
  },
  mounted () {
    this.getList()
  },
  methods: {
    getGroup () {
      const params = {
        type: 1
      }
      groupAPI.getGroupList(params).then(res => {
        this.groupList = res.data.payload
      })
    },
    getDict () {
      const params = {
        dictValue: 'BOOT_TYPE'
      }
      commonAPI.getDictByValue(params).then(res => {
        this.bootTypeDict = res.data.payload
      })
    },
    getCameraList () {
      commonAPI.getCameraList().then(res => {
        this.cameraList = res.data.payload
      })
    },
    getList (page = 1, limit = this.limit) {
      const pageNum = (page - 1 ) * limit
      const params = {
        taskType: 'PASSENGER'
      }
      taskAPI.getTaskPageList(pageNum, limit, params).then(res => {
        this.tableList = res.data.payload.rows
        this.tableList.forEach(item => {
          if (item.groupId) {
            const groupName = this.groupList
              .find(group => group.id === item.groupId)
            item.groupName = groupName ? groupName.name : ''
          }
          const taskConfig = JSON.parse(item.taskConfig)
          Object.keys(taskConfig).forEach(key => {
            item[key] = taskConfig[key]
          })
        })
        this.total = res.data.payload.total
      })
    },
    addTask () {
      const params = Object.assign({ taskType: 'CAR' }, this.formData)
      params.taskType = 'PASSENGER'
      params.stopTime = dayjs(params.triggerTime).add(params.taskTime, 'h').format('HH:mm:ss')
      params.taskConfig = JSON.stringify({ rate: params.rate, alarm: params.alarm })
      // if (params.cameraIds) params.cameraIds = params.cameraIds.join(',')
      if (params.triggerTime) params.triggerTime = dayjs(params.triggerTime).format('HH:mm:ss')
      delete params.rate
      delete params.alarm
      taskAPI.addTask(params).then(() => {
        this.getList()
      })
    },
    confirm () {
      if (this.type === 'add') {
        this.addTask()
      } else {
        this.updateTask()
      }
    },
    bootTask (id) {
      taskAPI.bootTask(id).then()
    },
    updateTask () {
      const params = Object.assign({}, this.formData)
      params.taskConfig = JSON.stringify({ rate: params.rate, alarm: params.alarm })
      params.stopTime = dayjs(params.triggerTime).add(params.taskTime, 'h').format('HH:mm:ss')
      // if (params.cameraCodes) params.cameraCodes = params.cameraCodes
      if (params.triggerTime) params.triggerTime = dayjs(params.triggerTime).format('HH:mm:ss')
      delete params.rate
      delete params.alarm
      taskAPI.updateTask(params.id, params).then(() => {
        this.getList()
      })
    },
    showModal (type, data) {
      this.type = type
      this.title = type === 'add' ? '新增' : '编辑'
      if (type === 'edit') {
        const formData = Object.assign({}, data)
        formData.triggerTime = dayjs(dayjs().format('YYYY-MM-DD') + formData.triggerTime).toDate()
        let startTimeStamp = formData.triggerTime.valueOf()
        let endTimeStamp =  dayjs(dayjs().format('YYYY-MM-DD') + formData.stopTime).valueOf()
        formData.taskTime = (endTimeStamp - startTimeStamp) / 3600000 
        if (endTimeStamp <= startTimeStamp) formData.taskTime += 24
        this.formData = formData
      }
      this.$refs.sideBar.showList()
    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    closedModal () {
      this.formData = {}
    }
  }
}
</script>

<style lang="less" scoped>
.task-manager {
  height: 100%;
  padding: 36px 24px;
  background: #21232d;
  .task-table {
    margin-top: 30px;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>