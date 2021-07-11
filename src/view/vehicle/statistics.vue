<template>
  <div class="vehicle-statistics">
    <div class="statistics-search">
      <el-form model="formData" label-width="90px">
        <el-row>
          <el-col span="5" label-width="100px">
            <el-form-item label="时间范围">
              <el-time-picker v-model="formData.starTime"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col span="5">
            <el-form-item label="区域">
              <el-select v-model="formData.group">
                <el-option value="1" label="t1航站"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="5">
            <el-form-item label="摄像机">
              <el-select v-model="formData.camera">
                <el-option value="1" label="摄像机1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="五类车类型">
              <el-select v-model="formData.vehicleType">
                <el-option value="1" label="汽车"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="statistics-btn" span="3">
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
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
export default {
  data () {
    return {
      formData: {}
    }
  },
  mounted () {
    this.renderLine()
    this.renderInterval()
  },
  methods: {
    renderInterval () {
      const data = [
        { type: '空港南一', value: 100 },
        { type: '空港南二', value: Math.round(Math.random() * 1000) },
        { type: '东一', value: Math.round(Math.random() * 1000) },
        { type: '东二', value:  Math.round(Math.random() * 1000) },
        { type: '西一', value: Math.round(Math.random() * 1000) },
        { type: '西二', value: Math.round(Math.random() * 1000) },
      ]
      const container = document.querySelector('#statistics-interval')
      console.log(container)
      const chart = new G2.Chart({
        container: 'statistics-interval',
        width: container.clientWidth,
        height: container.clientHeight,
        forceFit: true,
        padding: [10, 20, 70, 90]
      })
      chart.data(data)
      chart.scale('value', {
        alias: '时长(分钟)',
        nice: true
      })
      chart.axis('value', {
        title: {
          offset: 70,
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
      // const position = chart.getXY(data[0])
      // const div = document.createElement('div')
      // div.className = 'g2-label-spec';
      // div.innerHTML = '<span style="color: #fff;" class="g2-label-spec-value">时长(分钟)</span>'
      // div.setAttribute('style', `top: ${position.y - 420}px;left: ${position.x - 200}px;`)
      // const chartContainer = chart.getCanvas().get('container')
      // chartContainer.appendChild(div)
    },
    renderLine () {
      const data = [
        { time: '10:30', rate: Math.round(Math.random() * 200) },
        { time: '11:00', rate: Math.round(Math.random() * 200) },
        { time: '11:30', rate: Math.round(Math.random() * 200) },
        { time: '12:00', rate:  Math.round(Math.random() * 200) },
        { time: '12:30', rate: Math.round(Math.random() * 200) },
        { time: '13:00', rate: Math.round(Math.random() * 200) },
      ]
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
        alias: '正常率（%）',
      })
      chart.scale('time', {
        range: [0, 1],
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
