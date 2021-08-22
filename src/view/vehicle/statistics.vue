<template>
  <div class="vehicle-statistics">
    <div class="statistics-search">
      <el-form :model="formData" label-width="90px" ref="form">
        <el-row>
          <el-col :span="5" label-width="100px">
            <el-form-item label="时间范围" prop="starTime">
              <el-date-picker type="datetimerange" v-model="formData.starTime" style="width: 80%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="区域" prop="groupId">
              <el-select v-model="formData.groupId" @change="groupChange">
                <el-option :value="group.id" :label="group.name" v-for="group in grouplist" :key="group.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="摄像机" prop="camera">
              <el-select v-model="formData.camera" multiple>
                <el-option :value="camera.cameraCode" :label="camera.cameraName" v-for="camera in cameraList" :key="camera.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="五类车类型" prop="carType">
              <el-select v-model="formData.carType">
                <el-option :value="type.detailValue" :label="type.detailName" v-for="type in carTypeDict" :key="type.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="statistics-btn" :span="3">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="statistics-chart">
      <div id="statistics-interval"></div>
      <div id="statistics-line"></div>
    </div>
  </div>
</template>

<script>
import * as G2 from '@antv/g2'
import dayjs from 'dayjs'
import vehicleAPI from '@/api/vehicleAPI'
import commonAPI from '@/api/commonAPI'
import groupAPI from '@/api/groupAPI'
export default {
  data () {
    return {
      formData: {},
      barDatas: [],
      lineDatas: [],
      carTypeDict: [],
      grouplist: [],
      cameraList: [],
      intervalChart: '',
      lineChart: ''
    }
  },
  mounted () {
    this.renderInterval()
    this.renderLine()
    this.getBarDatas()
    this.getLineDatas()
    this.getRateDict()
    this.getGroupList()
  },
  methods: {
    getRateDict () {
      const params = {
        dictValue: 'CAR_TYPE'
      }
      commonAPI.getDictByValue(params).then(res => {
        this.carTypeDict = res.data.payload
      })
    },
    getGroupList () {
      const params = {
        code: '0-CAR',
      }
      groupAPI.listSonByParent(params).then(res => {
        this.grouplist = res.data.payload
      })
    },
    getChildrenNode (id, groups) {
      groups.push(id)
      const children = this.grouplist.filter(item => item.parentId === id)
      children.forEach(item => {
        this.getChildrenNode(item.id, groups)
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
    search () {
      const params = {
        createTime_gt: this.formData.starTime && dayjs(this.formData.starTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        createTime_lt: this.formData.starTime && dayjs(this.formData.starTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        carType: this.formData.carType,
        areaCodeList: this.formData.camera.join(','),
      }
      const gruopIds = []
      if (this.formData.groupId) {
        this.getChildrenNode(this.formData.groupId, gruopIds)
      }
      params.groupIdList = gruopIds.join(',')
      this.getBarDatas(params)
      this.getLineDatas(params)
    },
    reset () {
      this.$refs.form.resetFields()
    },
    getBarDatas (params) {
      vehicleAPI.statListByCamera(params).then(res => {
        console.log(res)
        const barDatas = res.data.payload.map(item => {
          return {
            type: item.name || '摄像机',
            value: item.count
          }
        })
        this.intervalChart.changeData(barDatas)
      })
    },
    getLineDatas (params) {
      vehicleAPI.statListByHour(params).then(res => {
        console.log(res)
        const lineDatas = res.data.payload.map(item => {
          return {
            time: item.hour_time,
            rate: item.count
          }
        })
        this.lineChart.changeData(lineDatas)
        // this.renderLine(res.data.payload)
      })
    },
    renderInterval () {
      const data = this.barDatas
      const container = document.querySelector('#statistics-interval')
      const chart = new G2.Chart({
        container: 'statistics-interval',
        width: container.clientWidth,
        height: container.clientHeight,
        forceFit: true,
        padding: [20, 20, 70, 90]
      })
      chart.data(data)
      chart.scale('value', {
        alias: '数量',
        nice: true
      })
      chart.axis('value', {
        title: {
          offset: 20,
          style: {
            fontSize: 16,
            fill: '#fff'
          }
        }
      })
      chart.interval().position('type*value').color('type', ['#7f8da9', '#fec514', '#db4c3c', '#daf0fd']).label('value', {
        offset: 5,
        style: {
          fill: '#fff'
        }
      })
      chart.render()
      this.intervalChart = chart
    },
    renderLine () {
      const data = this.lineDatas
      console.log(data)
      const container = document.querySelector('#statistics-line')
      const chart = new G2.Chart({
        container: 'statistics-line',
        width: container.clientWidth,
        height: container.clientHeight,
        forceFit: true,
        padding: [30, 20, 70, 90]
      })
      chart.data(data)
      chart.scale('rate', {
        alias: '数量',
      })
      chart.scale('time', {
        // range: [0, 1],
        nice: true
      })
      chart.axis('rate', {
        // position: 'top
        title: {
          offset: 40,
          style: {
            fontSize: 16,
            fill: '#fff'
          },
          autoRotate: true
        }
      })
      chart.tooltip({
        showTitle: true,
        showCrosshairs: true,
        style: {
          fill: '#fff'
        }
      })
      chart.line().position('time*rate').label('rate', {
        offset: 20,
        style: {
          fill: '#fff'
        }
      })
      chart.render()
      this.lineChart = chart
    }
  }
}
</script>

<style lang="less" scoped>
.vehicle-statistics {
  // height: 100%;
  min-height: 100%;
  padding: 24px;
  background: #21232d;
  .statistics-search {
    padding: 28px 20px 4px;
    border: 1px solid #13585c;
    .statistics-btn {
      text-align: right;
    }
  }
  .statistics-chart {
    display: flex;
    height: calc(100% - 120px);
    margin-top: 80px;
    #statistics-interval {
      flex: 1;
      height: 500px;
    }
    #statistics-line {
      flex: 1;
    }
  }
}
</style>
<style lang="less">
  .g2-label-spec {
    font-size: 12px;
    text-align: center;
    position: absolute;
    width: 200px;
    color: #595959;
  }

  .g2-label-spec-value {
    color: #ff5250;
    font-weight: bold;
  }
</style>
