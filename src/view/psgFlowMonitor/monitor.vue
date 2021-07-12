<template>
  <div class="flow-monitor">
    <div class="task-list">
      <div class="task-title">任务列表</div>
      <div class="list">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="content">
      <div class="videoContent">
        <div class="video"></div>
        <div class="heatMap">
          <div class="heatMap-title">热力图</div>
          <img src="" alt="">
        </div>
      </div>
      <div class="table">
        <el-table :data="tableList" border>
          <el-table-column label="当前场景人数" align="center" prop="all"></el-table-column>
          <el-table-column label="区域1人数" align="center" prop="1"></el-table-column>
          <el-table-column label="区域2人数" align="center" prop="2"></el-table-column>
          <el-table-column label="区域3人数" align="center" prop="3"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableList: [
        { all: 10, 1: 2, 2: 5, 3: 3 }
      ],
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      treeData: [
        {
          id: 1, label: '客流监控',
          children: [
            { id: 2, label: 't1航站', children: [ { id: 3, label: 'a区' } ] },
            { id: 4, label: 't2航站', children: [ { id: 5, label: 'b区' } ] }
          ]
        }
      ]
    }
  },
  mounted () {
    this.frameRegister()
    this.createVideo()
  },
  beforeDestroy () {
    this.destroyVideo()
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
      this.startVideo()
    },
    frameRegister () {
      const cxxNotifier = (cmd) => {
        switch (cmd) {
          case 'stoplay':
            this.stopVideo()
            break
          case 'startplay':
            this.startVideo()
            break
          case 'destroyplayer':
            this.destroyVideo()
            break
          default:
            break
        }
      }
      window.bykj && window.bykj.frameRegister(cxxNotifier);
    },
    createVideo () {
      const rect = document.querySelector('.video').getBoundingClientRect()
      console.log(rect)
      const json = {
        players: [
          { 
            id: '1',
            x: rect.left,
            y: rect.top,
            w: rect.width,
            h: rect.height
          }
        ]
      }
      window.bykj && window.bykj.frameCall('createplayer', JSON.stringify(json))
    },
    startVideo () {
      var json={
        players: [{
          id: '1', 
          camera:{
            type:0,
            domain:"YFGZHOM1.A1",
            id:	"000002X0000",
            level: 0,
          }
        }]
      }
      window.bykj && window.bykj.frameCall('startplay', JSON.stringify(json))
    },
    stopVideo () {
      var json={
        players:[{
          id: '1'
        }]
      }
      window.bykj && window.bykj.frameCall('stopplay', JSON.stringify(json))
    },
    destroyVideo () {
      var json={
        players:[{
          id: '1',
        }]
      }
      window.bykj && window.bykj.frameCall('destroyplayer', JSON.stringify(json));
    }
  }
}
</script>

<style lang="less" scoped>
.flow-monitor {
  display: flex;
  min-height: 100%;
  box-sizing: border-box;
  padding: 24px;
  background: #21232d;
  .task-list {
    width: 354px;
    flex-shrink: 0;
    .task-title {
      width: 126px;
      height: 48px;
      background: url('../../assets/tab_bg@2x.jpg');
      background-size: 100% 100%;
      text-align: center;
      line-height: 48px;
      color: #2dccd3;
    }
    .list {
      height: calc(100% - 48px);
      box-sizing: border-box;
      padding: 23px;
      border: 1px solid #13585c;
    }
  }
  .content {
    width: calc(100% - 354px);
    margin-left: 24px;
    border: 1px solid #13585c;
    .videoContent {
      display: flex;
      .video,
      .heatMap {
        flex: 1
      }
      .video {
        height: 496px;
        border: 1px solid #2dccd3;
      }
      .heatMap {
        border: 1px solid #13585c;
        .heatMap-title {
          padding: 9px 24px 8px;
          font-size: 18px;
          line-height: 1;
          color: #fff;
        }
        img {
          width: 100%;
        }
      }
    }
    .table {
      padding: 24px;
    }
  }
}
</style>

<style lang="less" scoped>
  // .el-tree {
  //   background: #21232d;
  //   color: #fff;
  // }
  // .el-tree-node__content:hover,
  // .el-tree-node:focus>.el-tree-node__content {
  //   background: #a2a4a7;
  // }
</style>