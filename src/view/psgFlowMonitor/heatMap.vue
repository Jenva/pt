<template>
  <div class="heatMap">
    <div class="area">
      <div class="select">
        <span class="text">区域：</span>
        <el-select v-model="selectedArea" placeholder="请选择区域">
          <el-option value="" label="全部"></el-option>
          <el-option :value="group.id" :label="group.name" v-for="group in grouplist" :key="group.id"></el-option>
        </el-select>
        <!-- <el-button @click="getMessage">test</el-button> -->
      </div>
      <div class="list">
        <el-table :data="tableList">
          <el-table-column label="区域" align="center" prop="groupName"></el-table-column>
          <el-table-column label="实时人数" align="center" prop="passengerCount"></el-table-column>
          <el-table-column label="摄像机" align="center" prop="list">
            <template slot-scope="scope">
              <el-button type="text" @click="showList(scope.row)">机位列表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="heat-map-img" ref="map" @mouseup="onMouseUp"
      @mousedown="onMousedown" @mousewheel="onMousewheel"
      @mouseover="showbtn = true" @mouseout="showbtn = false"
    >
      <div class="tip">
        <span style="font-size: 16Px">当前人数：</span>
        <span class="count">{{totalCount}}</span>
      </div>
      <el-button @click="reset" v-show="showbtn" class="heat-map-rest-btn">复原</el-button>
      <div ref="mapImg" class="mapImg" @mousemove="onMousemove">
        <div id="mask" style="width: 100%;height: 100%;position: relative;z-index: 1000"></div>
        <template v-for="item in tableList">
          <img :src="downloadFile(file.url)" alt="" v-for="(file, index) in item.files" :key="index" class="image" :style="setStyle(file)" ref="image">
        </template>
      </div>
      <div class="point">x: {{pointData.x}}, y: {{pointData.y}}</div>
    </div>
    <div class="right-side" v-show="showModal">
      <div class="content" ref="modalContent">
        <window-top-title title="摄像机列表" class="title" @close="closeModal"></window-top-title>
        <div class="table">
          <el-table :data="videoList">
            <el-table-column label="设备名" prop="cameraName" align="center"></el-table-column>
            <el-table-column label="是否可用" prop="isCanUse" align="center">
              <template>
                <span>是</span>
              </template>
            </el-table-column>
            <el-table-column label="播放" prop="cameraTypeDict" align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom-nav">
          <el-button size="small" @click="closeModal">关闭</el-button>
          <el-button type="primary" size="small" @click="closeModal">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import windowTopTitle  from '@/components/windowTopTitle'
import groupAPI from '@/api/groupAPI'
import psgAPI from '@/api/psgAPI'
import commonAPI from '@/api/commonAPI'
export default {
  components: {
    windowTopTitle
  },
  data () {
    return {
      total: 50,
      scaleNum: 1,
      offsetLeft: null,
      offsetTop: null,
      scaleOffset: 0.05, // 缩放幅度
      rotateDeg: 0,
      distanceY: null,
      distanceX: null,
      isMouseDown: false,
      showbtn: false,
      selectedArea: '',
      showModal: false,
      grouplist: [],
      camreaInfos: [],
      pointData: {},
      totalCount: 0,
      tableList: [],
      videoList: [
        { deviceName: '摄像机1', isCanUse: '是', playType: '实时播放' }
      ]
    }
  },
  watch: {
    showModal (data) {
      if (data) {
        setTimeout(() => {
          this.$refs.modalContent.classList = 'content show'
        })
        document.documentElement.style.overflowY = 'hidden'
      } else {
        document.documentElement.style.overflowY = 'auto'
      }
    }
  },
  created () {
    this.getCameraInfo()
    this.getGroupList()
  },
  mounted () {
    this.getPoint()
  },
  methods: {
    connectWebsocket() {
      const ws = new WebSocket('ws://10.10.220.141:9088/v1/renqun')
      ws.onmessage = this.getMessage
    },
    getPoint () {
      const target = document.querySelector('#mask')
      target.addEventListener('mousemove', (e) => {
        const x = e.offsetX > 0 ? e.offsetX : 0
        const y = e.offsetY > 0 ? e.offsetY : 0
        this.pointData = {
          x: (x  / target.clientWidth * 10000).toFixed(0),
          y: (((target.clientHeight - y) / target.clientHeight) * 10000).toFixed(0)
        }
      }, true)
    },
    onMousewheel (event) {
      event.preventDefault()
      const mapImg = this.$refs['mapImg']
      const mapWrapper = this.$refs['map']
      if (!mapImg.style.bottom || mapImg.style.bottom === '0px') {
        mapImg.style.left = ((mapWrapper.clientWidth - mapImg.clientWidth) / 2) + 'px'
        mapImg.style.top = ((mapWrapper.clientHeight - mapImg.clientHeight) / 2) + 'px'
        mapImg.style.bottom = 'auto'
        mapImg.style.right = 'auto'
      }
      const oldScale = this.scaleNum
      if (event.deltaY > 0) {
        if (this.scaleNum < 0.2) return
        this.scaleNum -= this.scaleOffset
      } else {
        this.scaleNum += this.scaleOffset
      }
      let offsetLeft, offsetTop
      if (this.offsetLeft !== null) {
        offsetLeft = this.offsetLeft
        offsetTop = this.offsetTop
      } else {
        offsetLeft = mapImg.offsetLeft
        offsetTop = mapImg.offsetTop
      }
      // 计算左偏移值
      const newOffsetX = this.scaleNum * event.offsetX
      const newOffsetLeft = (event.offsetX * oldScale) + offsetLeft - newOffsetX
      this.offsetLeft = newOffsetLeft
      const middleX = newOffsetLeft + ((mapImg.clientWidth * this.scaleNum) / 2)
      mapImg.style.left = (middleX - (mapImg.clientWidth / 2)) + 'px'
      // 计算上偏移值
      const newOffsetY = this.scaleNum * event.offsetY
      const newOffsetTop = (event.offsetY * oldScale) + offsetTop - newOffsetY
      this.offsetTop = newOffsetTop
      const middleY = newOffsetTop + ((mapImg.clientHeight * this.scaleNum) / 2)
      mapImg.style.top = (middleY - (mapImg.clientHeight / 2)) + 'px'
      mapImg.style.transform = `scale(${this.scaleNum}) rotate(${this.rotateDeg + 'deg'})`
    },
    onMousedown(event) {
      const mapImg = this.$refs['mapImg']
      this.distanceX = event.clientX - mapImg.offsetLeft
      this.distanceY = event.clientY - mapImg.offsetTop
      this.isMouseDown = true
    },
    onMouseUp() {
      this.isMouseDown = false
    },
    onMousemove(event) {
      if (!this.isMouseDown) return
      const mapImg = this.$refs['mapImg']
      const { distanceX, distanceY } = this
      if (!mapImg.style.bottom || mapImg.style.bottom === '0px') {
        mapImg.style.bottom = 'auto'
        mapImg.style.right = 'auto'
      }
      const oevent = event
      mapImg.style.left = oevent.clientX - distanceX + 'px'
      mapImg.style.top = oevent.clientY - distanceY + 'px'
      this.offsetLeft = oevent.clientX - distanceX - (mapImg.clientWidth * (this.scaleNum - 1)) / 2
      this.offsetTop = oevent.clientY - distanceY - (mapImg.clientHeight * (this.scaleNum - 1)) / 2
    },
    reset () {
      const mapImg = this.$refs['mapImg']
      mapImg.style.top = 0
      mapImg.style.left = 0
      mapImg.style.right = 0
      mapImg.style.bottom = 0
      this.scaleNum = 1
      this.rotateDeg = 0
      mapImg.style.transform = `scale(${this.scaleNum})`
      this.distanceX = null
      this.distanceY = null
      this.offsetLeft = null
      this.offsetTop = null
    },
    getMessage (evt) {
      const message = evt.data && JSON.parse(evt.data)
      // const message = {
      //   "command":"report",
      //   "appid":"renqun",
      //   "taskid":"20",
      //   "taskname":"办公室1测试客流",
      //   "data": {
      //     "domain":"GZYFHOM1.A1",
      //     "camera":"10.10.74.30",
      //     "time":"2021-08-25 15:42:57",
      //     "ms":0,
      //     "groupid": 5,
      //     "detail":{
      //         "regions":[
      //             {
      //               "id":0,
      //               "value":0
      //             }
      //         ],
      //         "value":4,
      //         "file": "group1/M00/02/82/CgrcjWEl9JiASpejAAAnUx2WpE8929.jpg"
      //     }
      //   }
      // }
      const data = {
        cameraCode: message.data.camera,
        groupId: Number(message.data.bi.groupid),
        file: message.data.detail.file,
        passengerCount: message.data.detail.value
      }
      const { newData, file } = this.getMapData(data)
      const sameData = this.tableList.find(item => item.groupId === newData.groupId)
      if (sameData) {
        this.handleSameData(sameData, file, newData)
      } else {
        this.tableList.push(newData)
        this.totalCount += file.count
      }
    },
    showList (row) {
      this.showModal = true
      this.getAllCameraInGroup(row.groupId, (data) => {
        data.payload.forEach(item => {
          item.cameraTypeDict = item.cameraType ? '历史回放' : '实时播放'
        })
        this.videoList = data.payload
        this.total = data.total
      })
    },
    handleSameData (sameData, file, newData) {
      const index = sameData.files.findIndex(file => file.code === newData.files[0].code)
      if (index > -1) {
        const picFile = sameData.files[index]
        this.totalCount += Number(file.count) -  Number(picFile.count)
        sameData.passengerCount += Number(file.count) - Number(picFile.count)
        sameData.files.splice(index, 1, newData.files[0])
      } else {
        sameData.files.push(file)
        sameData.passengerCount += file.count
        this.totalCount += file.count
      }
    },
    getMapData (message) {
      const groupName = this.grouplist.find(value => value.id === message.groupId)
      const file = {
        url: message.file,
        count: message.passengerCount,
        code: message.cameraCode
      }
      const info = this.camreaInfos.find(value => value.cameraCode === message.cameraCode && message.groupId === value.groupId)
      if (info) {
        file.configJson = info.configJson && JSON.parse(info.configJson)
      }
      const newData = {
        files: [file],
        groupId: message.groupId,
        groupName: groupName ? groupName.name : '-',
        passengerCount: message.passengerCount
      }
      return { newData, file }
    },
    getList () {
      this.totalCount = 0
      const params = {
        groupId: this.selectedArea
      }
      psgAPI.getRealTimeByGroupId(params).then(res => {
        let count = 0
        if (!res.data.payload) {
          this.tableList = []
          return
        }
        const length = res.data.payload.length
        const map = new Map()
        res.data.payload.forEach(async item => {
          // const cameraList = this.camreaInfos
          // this.getCameraInfo(item.groupId, ({payload}) => {
            if (map.has(item.groupId)) {
              const { file } = this.getMapData(item)
              const data = map.get(item.groupId)
              data.files.push(file)
              data.passengerCount += item.passengerCount
              map.set(item.groupId, data)
            } else {
              const { newData } = this.getMapData(item)
              map.set(item.groupId, newData)
            }
            count++
            if (count === length) {
              this.tableList = [...map.values()].flat()
              this.tableList.forEach(item => {
                this.totalCount += item.passengerCount
              })
              console.log(this.tableList)
            }
          // })
        })
      })
    },
    downloadFile (id) {
      return commonAPI.downloadFile(id)
    },
    setStyle (data) {
      const configJson = data.configJson
      if (configJson) {
        const bottom = (configJson.y / 10000).toFixed(4) * 100 + '%'
        const left = (configJson.x / 10000).toFixed(4) * 100 + '%'
        return `bottom: ${bottom};left: ${left};opacity: 0.7;`
      }
      return ''
    },
    getAllCameraInGroup (id, cb) {
      const params = {
        groupId: id
      }
      psgAPI.listByGroupId(params).then((res) => {
        this.camreaInfos = res.data.payload
        cb(res.data)
      })
    },
    getCameraInfo (id) {
      const params = {
        groupId: id
      }
      psgAPI.listByGroupId(params).then((res) => {
        this.camreaInfos = res.data.payload
        this.getList()
        // cb(res.data)
      })
    },
    closeModal () {
      setTimeout(() => {
        this.$refs.modalContent.classList = 'content'
      })
      setTimeout(() => {
        this.showModal = false
      }, 600)
    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    getGroupList () {
      const params = {
        code: 'PSG'
        // type: 1
      }
      groupAPI.listSonByParent(params).then(res => {
        this.grouplist = res.data.payload
      })
    },
  }
}
</script> 

<style lang="less" scoped>
@bgPic: '../../assets/bg.png';
.heatMap {
  display: flex;
  height: 100%;
  background: #1f2831;
  box-sizing: border-box;
  padding: 24px;
  .area {
    width: 444px;
    height: 100%;
    padding: 23px;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid #13585c;
    .select {
      margin-bottom: 30px;
      .text {
        font-size: 16Px;
        color: #fff;
      }
    }
  }
  .heat-map-img {
    flex: 1;
    height: 100%;
    position: relative;
    margin-left: 24px;
    border: 1px solid #13585c;
    overflow: hidden;
    .heat-map-rest-btn {
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 1100;
      background: #13585c;
    }
    .mapImg {
      position: relative;
      width: 99%;
      height: 100%;
      margin: auto;
      background: url(@bgPic);
      background-size: 100% 100%;
    }
    .point {
      position: absolute;
      right: 50px;
      bottom: 50px;
      font-size: 30px;
      z-index: 500;
      color: #0094ff;
    }
    .tip {
      position: absolute;
      width: 240px;
      height: 60px;
      top: 0;
      left: 0;
      text-indent: 25px;
      line-height: 60px;
      background: #13585c;
      color: #83a2af;
      z-index: 10;
      .count {
        font-size: 20px;
        color: #fff;
        font-weight: 700;
      }
    }
    .image {
      position: absolute;
      width: 200px;
      height: 150px;
    }
  }
  .right-side {
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 2000;
    .content {
      position: absolute;
      width: 40%;
      height: 100%;
      top: 0;
      bottom: 0;
      right: -40%;
      background: #21232d;
      transition: right 0.8s;
      padding-bottom: 60px;
      .title {
        border-top: 1px dashed #13585c;
        border-bottom: 1px dashed #13585c;
      }
      .table {
        height: calc(100% - 160px);
        padding: 40px 24px 24px;
        overflow: auto;
        .page {
          margin-top: 20px;
          text-align: right;
        }
      }
      .bottom-nav {
        position: absolute;
        width: 100%;
        height: 60px;
        bottom: 60px;
        right: 0;
        text-align: center;
        border-top: 1px solid #13585c;
        border-bottom: 1px solid #13585c;
        line-height: 60px;
      }
    }
    .content.show {
      right: 0;
    }
  }
}
</style>
<style lang="less">
.heatMap {
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