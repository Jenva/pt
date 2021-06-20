<template>
  <div class="vehicle-monitor">
    <div class="task-list">
      <div class="task-title">任务列表</div>
      <div class="list">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="vehicle-content">
      <div class="content-main">
        <div class="vehicle-video"></div>
        <div class="vehicle-current-list">
          <div class="title">最近捕获车辆</div>
          <div class="list">
            <div class="cell">
              <img src="" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <div class="title">今日0点至今五类车进出统计表</div>
        <div class="table">
          <el-table :data="tableList" width="100%">
            <el-table-column label="汽车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="公交车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="三轮车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="自行车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="卡车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="摩托车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableList: [
        { enter: 1 }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [
        {
          id: 1,
          label: '五类车',
          children: [
            { id: 2, label: 'T1航站楼', children: [ { id: 3, label: '摄像头1' } ] },
            { id: 4, label: 'T2航站楼', children: [ { id: 5, label: '摄像头2' } ] }
          ]
        }
      ]
    }
  },
  methods: {
    toDetail () {},
    handleNodeClick (data) {
      console.log(data)
      this.createVideo()
    },
    createVideo () {
      const json = {
        players: [
          { 
            x: 400,
            y: 24,
            width: 1174,
            height: 638
          }
        ]
      }
      window.bykj.frameCall('createplayer', json)
    },
  }
}
</script>

<style lang="less" scoped>
.vehicle-monitor {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  background: #21232d;
  .task-list {
    width: 354px;
    height: 870px;
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
  .vehicle-content {
    flex: 1;
    margin-left: 24px;
    padding-bottom: 13px;
    border: 1px solid #13585c;
    .content-main {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      height: 638px;
      .vehicle-video {
        flex: 1;
        border: 1px solid #2dccd3;
      }
      .vehicle-current-list {
        width: 266px;
        margin: 0 23px 0 24px;
        .title {
          padding: 10px 0;
          font-size: 18px;
          line-height: 1;
          color: #fff;
        }
        .list {
          height: calc(100% - 48px);
          padding-top: 10px;
          overflow: auto;
          .cell {
            margin-bottom: 18px;
            border: 1px solid #13585c;
            img {
              width: 100%;
            }
          }
        }
      }
    }
    .content-bottom {
      padding: 23px;
      .title {
        padding: 4px 0 21px 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 1;
        color: #2dccd3;
      }
    }
  }
}
</style>
<style lang="less">
.vehicle-monitor {
  .el-table th, .el-table tr  {
    background: #21232d!important;
    color: #fff;
  }
  .el-table tbody tr:hover>td {
    color: #000;
    background-color: #a2a4a7!important;
  }
  /*table边框颜色*/
  .el-table--border:after,
  .el-table--group:after,
  .el-table:before {
    background-color: #13585c;
  }
  .el-table--border,
  .el-table--group {
    border-color: #13585c;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #13585c;
  }

  .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #13585c;
  }

  .el-table--border td,
  .el-table--border th {
    border-right: 1px solid #13585c;
  }
  .el-tree {
    background: #21232d;
    color: #fff;
  }
  .el-tree-node__content:hover,
  .el-tree-node:focus>.el-tree-node__content {
    background: #a2a4a7;
  }
}
</style>