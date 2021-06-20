<template>
  <div class="stat-list">
    <div class="search">
      <el-form :model="formData" inline>
        <el-row>
          <el-col span="7">
            <el-form-item label="时间范围">
              <el-date-picker type="datetimerange" v-model="formData.createTime" style="width: 90%"></el-date-picker>
            </el-form-item>
          </el-col>          
          <el-col span="6">
            <el-form-item label="区域">
              <el-select placeholder="请选择区域" v-model="formData.area">
                <el-option value="1">t1</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="6">
            <el-form-item label="五类车类型">
              <el-select placeholder="请选择五类车类型" v-model="formData.type">
                <el-option value="1">汽车</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="5">
            <el-button>清除数据</el-button>
            <el-button type="primary">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableList" border>
        <el-table-column label="区域" prop="area" align="center"></el-table-column>
        <el-table-column label="统计时段" prop="time" align="center"></el-table-column>
        <el-table-column label="车辆类型" prop="vehicleType" align="center"></el-table-column>
        <el-table-column label="车辆进入" prop="vehicleIn" align="center"></el-table-column>
        <el-table-column label="车辆离开" prop="vehicleOut" align="center"></el-table-column>
        <el-table-column label="视频回放" align="center" prop="review">
          <template slot-scope="scope">
            <el-button size="mini">
              <img src="../../assets/vehiclemanagement_icon_historicversion_normal.png" alt="" style="vertical-align: middle">
              {{'历史视频' + scope.row.review}}
            </el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      total: 50,
      formData: {
        createTime: [],
      },
      tableList: [
        { area: 't1', time: '2010-10-10 20:20:20', vehicleType: '汽车', vehicleIn: 1, vehicleOut: 2, review: 1 }
      ]
    }
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {

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