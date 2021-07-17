<template>
  <div class="stat-list">
    <div class="search">
      <el-form :model="formData" inline>
        <el-row>
          <el-col :span="7">
            <el-form-item label="触发时间">
              <el-date-picker
                type="datetimerange"
                v-model="formData.createTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 90%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col :span="6">
            <el-form-item label="区域">
              <el-select placeholder="请选择区域" v-model="formData.area">
                <el-option :value="group.id" :label="group.name" v-for="group in groupList" :key="group.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableList" border>
        <el-table-column label="区域" prop="area" align="center"></el-table-column>
        <el-table-column label="统计时段" prop="time" align="center"></el-table-column>
        <el-table-column label="客流量" prop="psgCount" align="center"></el-table-column>
        <el-table-column label="视频回放" prop="review" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="playVideo(scope.row)">
              历史视频
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="热力截图" prop="heatMap" align="center">
          <template slot-scope="scope">
            <el-button size="mini">
              {{'热力图' + scope.row.heatMap}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="警告指标" align="center" prop="warningCount"></el-table-column>
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
  </div>
</template>

<script>
import groupAPI from '@/api/groupAPI'
import days from 'dayjs'
export default {
  data () {
    return {
      formData: {},
      total: 50,
      tableList: [
        { area: 't1', time: '2010-10-10 20:20:20', psgCount: '100', review: 1, heatMap: 2, warningCount: 1 }
      ],
      groupList: []
    }
  },
  mounted () {
    this.getGroupList()
  },
  methods: {
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
        this.groupList = res.data.payload
      })
    },
    playVideo (data) {
      var cur = new Date();
      var startTime = days(cur).subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss')
      var stopTime = days(cur).format('YYYY-MM-DD HH:mm:ss')
      var json = {
          type:1,
          domain: data.serverId || "YFGZHOM1.A1",
          id:	data.id || "000002X0000",
          level: 0,
          begin: startTime,
          end: stopTime
      }
      window.bykj && window.bykj.frameCall('popup', JSON.stringify(json)); 
    }
  }
}
</script>

<style lang="less" scoped>
.stat-list {
  height: 100%;
  padding: 24px;
  background: #21232d;
  .search {
    padding: 42px 20px 20px;
    border: 1px solid #13585c;
    background: #1f2831;
  }
  .table {
    margin-top: 50px;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>