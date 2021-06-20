<template>
  <div class="task-manager">
    <div class="task-add">
      <el-button size="samll" type="primary" icon="el-icon-plus" @click="showModal('add')">新增任务</el-button>
    </div>
    <div class="task-table">
      <el-table :data="tableList">
        <el-table-column label="任务名" prop="name" align="center"></el-table-column>
        <el-table-column label="区域" prop="area" align="center"></el-table-column>
        <el-table-column label="采集频率" prop="rate" align="center"></el-table-column>
        <el-table-column label="摄像机" prop="gun" align="center"></el-table-column>
        <el-table-column label="启动时间" prop="starTime" align="center"></el-table-column>
        <el-table-column label="告警指标" prop="warningCount" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="showModal('edit', scope.row)">
                <img src="../../assets/passengerflowmanagement_icon_edit_normal.png" alt="" style="vertical-align: middle">
                编辑
              </el-button>
              <el-button type="text">
                <img src="../../assets/passengerflowmanagement_icon_suspend_normal.png" alt="" style="vertical-align: middle">
                启动
              </el-button>
            </div>
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
    <sideBar ref="sideBar" :title="title" @close="closedModal">
      <div class="form">
        <el-form :model="formData" label-width="100px">
          <el-form-item label="任务名:">
            <el-input v-model="formData.taskName"></el-input>
          </el-form-item>
          <el-form-item label="区域:">
            <el-input v-model="formData.area"></el-input>
          </el-form-item>
          <el-form-item label="启动方式:">
            <el-radio-group v-model="formData.openType">
              <el-radio :label="1">定时触发</el-radio>
              <el-radio :label="2">单次启动</el-radio>
              <el-radio :label="3">一直启动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="触发时间:">
            <el-input v-model="formData.starTime"></el-input>
          </el-form-item>
          <el-form-item label="任务时长:">
            <el-input v-model="formData.taskTime"></el-input>
          </el-form-item>
          <el-form-item label="摄像机:">
            <el-select v-model="formData.gun">
              <el-option value="1" label="10.01.2.0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采集频率:">
            <el-select v-model="formData.rate">
              <el-option value="1" label="10分钟" key="1"></el-option>
              <el-option value="2" label="20分钟" key="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警指标:">
            <el-input v-model="formData.warningCount"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sideBar>
  </div>
</template>

<script>
import sideBar from '@/components/sideBar'
export default {
  components: {
    sideBar
  },
  data () {
    return {
      tableList: [
        { name: '任务1', area: '西三指廊', rate: '10分钟', gun: '1.108.20.3', startTime: '2021-04-23 09:00:00', warningCount: '999' }
      ],
      total: 40,
      title: '',
      formData: {
        rate: ''
      }
    }
  },
  methods: {
    showModal (type, data) {
      this.title = type === 'add' ? '新增' : '编辑'
      this.formData = data
      this.$refs.sideBar.showList()
    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    closedModal () {
      this.formData = {}
    }
  }
}
</script>

<style lang="less" scoped>
.task-manager {
  height: 100%;
  padding: 36px 24px;
  background: #21232d;
  .task-table {
    margin-top: 30px;
  }
  .page {
    margin-top: 20px;
    text-align: right;
  }
}
</style>