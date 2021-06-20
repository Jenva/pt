<template>
  <div class="heatMap">
    <div class="area">
      <div class="select">
        <span class="text">区域：</span>
        <el-select v-model="selectedArea" placeholder="请选择区域">
          <el-option value="1">t1</el-option>
        </el-select>
      </div>
      <div class="list">
        <el-table :data="tableList">
          <el-table-column label="区域" align="center" prop="area"></el-table-column>
          <el-table-column label="实时人数" align="center" prop="count"></el-table-column>
          <el-table-column label="摄像机" align="center" prop="list">
            <template slot-scope>
              <el-button type="text" @click="showList">机位列表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="heat-map-img">
      <div class="tip">
        当前人数：<span class="count">411</span>
      </div>
    </div>
    <div class="right-side" v-show="showModal">
      <div class="content" ref="modalContent">
        <window-top-title title="摄像机列表" class="title" @close="closeModal"></window-top-title>
        <div class="table">
          <el-table :data="videoList">
            <el-table-column label="设备名" prop="deviceName" align="center"></el-table-column>
            <el-table-column label="是否可用" prop="isCanUse" align="center"></el-table-column>
            <el-table-column label="播放" prop="playType" align="center"></el-table-column>
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
export default {
  components: {
    windowTopTitle
  },
  data () {
    return {
      total: 50,
      selectedArea: '',
      showModal: false,
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
  methods: {
    showList () {
      this.showModal = true
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

    }
  }
}
</script> 

<style lang="less" scoped>
.heatMap {
  display: flex;
  height: 100%;
  background: #1f2831;
  padding: 24px;
  .area {
    width: 444px;
    padding: 23px;
    border: 1px solid #13585c;
    .select {
      margin-bottom: 30px;
      .text {
        color: #fff;
      }
    }
  }
  .heat-map-img {
    position: relative;
    flex: 1;
    margin-left: 24px;
    border: 1px solid #13585c;
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
        padding: 40px 24px 24px;
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