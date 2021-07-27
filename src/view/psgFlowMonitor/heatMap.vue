<template>
  <div class="heatMap">
    <div class="area">
      <div class="select">
        <span class="text">区域：</span>
        <el-select v-model="selectedArea" placeholder="请选择区域" @change="getList">
          <el-option :value="group.id" :label="group.name" v-for="group in grouplist" :key="group.id"></el-option>
        </el-select>
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
    this.getGroupList()
  },
  mounted () {
    this.getList()
  },
  methods: {
    showList (row) {
      this.showModal = true
      this.getCameraInfo(row.groupId, (data) => {
        data.payload.forEach(item => {
          item.cameraTypeDict = item.cameraType ? '历史回放' : '实时播放'
        })
        this.videoList = data.payload
        this.total = data.total
      })
    },
    getList () {
      this.totalCount = 0
      const params = {
        groupId: this.selectedArea
      }
      psgAPI.getRealTimeByGroupId(params).then(res => {
        console.log(res)
        let count = 0
        const length = res.data.payload.length
        const map = new Map()
        res.data.payload.forEach(async item => {
          this.getCameraInfo(item.groupId, ({payload}) => {
            if (map.has(item.groupId)) {
              const data = map.get(item.groupId)
              const file = { url: item.file }
              const info = payload.find(value => value.cameraCode === item.cameraCode)
              if (info) {
                file.configJson = info.configJson && JSON.parse(info.configJson)
              }
              data.files.push(file)
              data.passengerCount += item.passengerCount
              map.set(item.groupId, data)
            } else {
              const groupName = this.grouplist.find(value => value.id === item.groupId)
              const file = { url: item.file }
              const info = payload.find(value => value.cameraCode === item.cameraCode)
              if (info) {
                file.configJson = info.configJson && JSON.parse(info.configJson)
              }
              const data = {
                files: [file],
                groupId: item.groupId,
                groupName: groupName ? groupName.name : '-',
                passengerCount: item.passengerCount
              }
              map.set(item.groupId, data)
            }
            count++
            if (count === length) {
              this.tableList = [...map.values()].flat()
              this.tableList.forEach(item => {
                this.totalCount += item.passengerCount
              })
              console.log(this.tableList)
            }
          })
        })
      })
    },
    getCameraInfo (id, cb) {
        const params = {
          groupId: id
        }
        psgAPI.listByGroupId(params).then((res) => {
          cb(res.data)
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
        // code: '0-CAR',
        type: 1
      }
      groupAPI.getGroupList(params).then(res => {
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
    padding: 23px;
    box-sizing: border-box;
    height: 919px;
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
    height: 919px;
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
      .count {
        font-size: 20px;
        color: #fff;
        font-weight: 700;
      }
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
}
</style>