<template>
  <div class="task-manager">
    <div class="task-add">
      <el-button size="samll" type="primary" icon="el-icon-plus" @click="showModal('add')">新增任务</el-button>
    </div>
    <div class="task-table">
      <el-table :data="tableList" height="100%">
        <el-table-column label="任务名" prop="name" align="center"></el-table-column>
        <el-table-column label="区域" prop="groupName" align="center"></el-table-column>
        <el-table-column label="采集频率" prop="rateDisplay" align="center"></el-table-column>
        <el-table-column label="摄像机" prop="gun" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.cameraCodes && scope.row.cameraCodes.join(',')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="启动时间" prop="triggerTime" align="center"></el-table-column>
        <el-table-column label="启动类型" prop="bootTypeDict" align="center"></el-table-column>
        <el-table-column label="告警指标" prop="alarm" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="showModal('edit', scope.row)">
                <img src="../../assets/passengerflowmanagement_icon_edit_normal.png" alt="" style="vertical-align: bottom">
                <span style="line-height: 24Px;margin-left: 5Px">编辑</span>
              </el-button>
              <el-button type="text" @click="bootTask(scope.row.id)" v-if="scope.row.bootStatus === 0">
                <img src="../../assets/passengerflowmanagement_icon_suspend_normal.png" alt="" style="vertical-align: bottom">
                <span style="line-height: 24Px;margin-left: 5Px">启动</span>
              </el-button>
              <el-button type="text" @click="stopTask(scope.row.id)" v-else>
                <img src="../../assets/nav_icon_closewindow_click.png" alt="" style="vertical-align: bottom">
                <span style="line-height: 24Px;margin-left: 5Px">停止</span>
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
        <el-form :model="formData" label-width="98px" ref="taskForm">
          <el-form-item label="任务名:" prop="name"
            :rules="{
              required: true, message: '任务名不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="区域:" prop="groupId"
            :rules="{
              required: true, message: '区域不能为空', trigger: 'blur'
            }"
          >
            <el-select v-model="formData.groupId" @change="groupChange">
              <el-option :value="item.id" :label="item.name" v-for="item in groupList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启动方式:" prop="bootType"
            :rules="{
              required: true, message: '启动方式不能为空', trigger: 'change'
            }"
          >
            <el-radio-group v-model="formData.bootType">
              <el-radio :label="type.detailValue" v-for="type in bootTypeDict" :key="type.id">{{ type.detailName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="触发时间:" prop="triggerTime"
            :rules="{
              required: true, message: '触发时间不能为空', trigger: 'blur'
            }"
          >
            <el-date-picker
              v-model="formData.triggerTime"
              type="datetime"
              placeholder="任意时间点">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务时长(单位:小时)" prop="taskTime"
            :rules="{
              required: true, message: '任务时长不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="formData.taskTime"></el-input>
          </el-form-item>
          <el-form-item label="摄像机:" prop="cameraCodes"
            :rules="{
              required: true, message: '摄像机不能为空', trigger: 'blur'
            }"
          >
            <el-select v-model="formData.cameraCodes">
              <el-option :value="camera.cameraCode" :label="camera.cameraName" v-for="camera in cameraList" :key="camera.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集频率:" prop="rate"
            :rules="{
              required: true, message: '采集频率不能为空', trigger: 'blur'
            }"
          >
            <el-select v-model="formData.rate" >
              <el-option :value="rate.detailValue" :label="rate.detailName" :key="rate.id" v-for="rate in rateDict"></el-option>
              <!-- <el-option value="10" label="10秒钟" key="1"></el-option>
              <el-option value="30" label="30秒钟" key="1"></el-option>
              <el-option value="60" label="1分钟" key="1"></el-option>
              <el-option value="300" label="5分钟" key="1"></el-option>
              <el-option value="600" label="10分钟" key="2"></el-option>
              <el-option value="1200" label="20分钟" key="2"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="告警指标:" prop="alarm" 
            :rules="{
              required: true, message: '告警指标不能为空', trigger: 'blur'
            }"
          >
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
      rateDict: [],
      type: '',
      total: 40,
      limit: 10,
      title: '',
      cameraList: [],
      formData: {
        cameraCodes: ''
      }
    }
  },
  created () {
    this.getDict()
    this.getRateDict()
    this.getCameraList()
    this.getGroup()
  },
  mounted () {
    this.getList()
  },
  methods: {
    getGroup () {
      const params = {
        code: 'PSG'
      }
      groupAPI.listSonByParent(params).then(res => {
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
    getRateDict () {
      const params = {
        dictValue: 'RATE'
      }
      commonAPI.getDictByValue(params).then(res => {
        this.rateDict = res.data.payload
      })
    },
    getCameraList (id) {
      const params = {
        groupId: id
      }
      groupAPI.getCameraListByGroupId(params).then(res => {
        this.cameraList = res.data.payload
      })
    },
    groupChange (data) {
      this.getCameraList(data)
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
          if (item.bootType) {
            item.bootTypeDict = this.bootTypeDict
              .find(value => value.detailValue === item.bootType).detailName
          }
          if (!Array.isArray(item.cameraCodes)) {
            item.cameraCodes = [item.cameraCodes]
          }
          const taskConfig = JSON.parse(item.taskConfig)
          Object.keys(taskConfig).forEach(key => {
            item[key] = taskConfig[key]
          })
          if (item.rate) {
            const rate = this.rateDict
              .find(rate => rate.detailValue === item.rate)
            item.rateDisplay = rate.detailName
          }
        })
        this.total = res.data.payload.total
      })
    },
    addTask () {
      const params = Object.assign({}, this.formData)
      params.taskType = 'PASSENGER'
      params.stopTime = dayjs(params.triggerTime).add(params.taskTime, 'h').format('YYYY-MM-DD HH:mm:ss')
      params.taskConfig = JSON.stringify({ rate: params.rate, alarm: params.alarm })
      params.cameraCodes = [params.cameraCodes]
      if (params.triggerTime) params.triggerTime = dayjs(params.triggerTime).format('YYYY-MM-DD HH:mm:ss')
      delete params.rate
      delete params.alarm
      taskAPI.addTask(params).then(() => {
        this.getList()
      })
    },
    confirm (cb) {
      this.$refs.taskForm.validate((res) => {
        if (res) {
          if (this.type === 'add') {
            this.addTask()
          } else {
            this.updateTask()
          }
          cb()
        }
      })
    },
    bootTask (id) {
      taskAPI.bootTask(id).then(() => {
        this.getList()
      })
    },
    stopTask (id) {
      taskAPI.stopTask(id).then(() => {
        this.getList()
      })
    },
    updateTask () {
      const params = Object.assign({}, this.formData)
      params.cameraCodes = [].concat(params.cameraCodes)
      params.taskConfig = JSON.stringify({ rate: params.rate, alarm: params.alarm })
      params.stopTime = dayjs(params.triggerTime).add(params.taskTime, 'h').format('YYYY-MM-DD HH:mm:ss')
      if (params.triggerTime) params.triggerTime = dayjs(params.triggerTime).format('YYYY-MM-DD HH:mm:ss')
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
        formData.cameraCodes = formData.cameraCodes.join(',')
        if (formData.triggerTime) {
          const triggerTime = dayjs(formData.triggerTime).toDate()
          let startTimeStamp = triggerTime.valueOf()
          let endTimeStamp =  dayjs(formData.stopTime).valueOf()
          formData.taskTime = (endTimeStamp - startTimeStamp) / 3600000 
          if (endTimeStamp <= startTimeStamp) formData.taskTime += 24
        }
        // formData.rate = (formData.rate / 25).toString()
        this.getCameraList(formData.groupId)
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
      this.$refs.taskForm.clearValidate()
    }
  }
}
</script>

<style lang="less" scoped>
.task-manager {
  height: 100%;
  padding: 36px 24px;
  overflow: hidden;
  box-sizing: border-box;
  background: #21232d;
  .el-input,
  .el-select {
    width: 90%;
  }
  .task-table {
    height: calc(100% - 150px);
    margin-top: 30px;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>

<style lang="less">
.task-manager {
  .el-table .cell {
    font-size: 16Px;
    line-height: 1.5;
  }
  .el-button {
    font-size: 16px;
    font-family: '宋体';
  }
}
</style>