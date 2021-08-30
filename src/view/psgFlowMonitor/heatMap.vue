<template>
  <div class="heatMap">
    <div class="area">
      <div class="select">
        <span class="text">区域：</span>
        <el-select v-model="selectedArea" placeholder="请选择区域" @change="getList">
          <el-option :value="group.id" :label="group.name" v-for="group in grouplist" :key="group.id"></el-option>
        </el-select>
        <el-button @click="getMessage">test</el-button>
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
    <div class="heat-map-img">
      <div class="tip">
        <span style="font-size: 16Px">当前人数：</span>
        <span class="count">{{totalCount}}</span>
      </div>
      <template v-for="item in tableList">
        <img :src="downloadFile(file.url)" alt="" v-for="(file, index) in item.files" :key="index" class="image" :style="setStyle(file)">
      </template>
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
      selectedArea: '',
      showModal: false,
      grouplist: [],
      camreaInfos: [],
      totalCount: 0,
      tableList: [
        { area: '东三走廊', count: 100 }
      ],
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
  },
  methods: {
    connectWebsocket() {
      const ws = new WebSocket('ws://10.10.220.141:9088/renqun')
      ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      console.log(evt)
      const message = evt.data && JSON.parse(evt.data)
      // const message = {
      //   "command":"report",
      //   "appid":"renqun",
      //   "taskid":"20",
      //   "taskname":"办公室1测试客流",
      //   "data": {
      //     "domain":"GZYFHOM1.A1",
      //     "camera":"1",
      //     "time":"2021-08-25 15:42:57",
      //     "ms":0,
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
      const info = this.camreaInfos.find(value => value.cameraCode === message.data.camera)
      const data = {
        cameraCode: message.data.camera,
        groupId: info.groupId,
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
      console.log(this.tableList)
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
      const info = this.camreaInfos.find(value => value.cameraCode === message.cameraCode)
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
    position: relative;
    flex: 1;
    height: 100%;
    margin-left: 24px;
    border: 1px solid #13585c;
    background: url(@bgPic);
    background-size: 100% 100%;
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