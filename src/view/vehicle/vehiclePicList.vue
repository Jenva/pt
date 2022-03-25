<template>
  <div class="vehicle-pic-list">
    <ul>
      <li v-for="pic in picList" :key="pic.id" class="picLi">
        <div class="pic">
          <img :src="downloadFile(pic.file_list[0])" alt="">
        </div>
        <div class="info">
          <span class="text">{{pic.carTypeDisplay}}</span>
          <el-button type="primary" style="float: right" size="small" @click="download(pic.file_list[0])">下载</el-button>
        </div>
        <p>{{pic.collect_time}}</p>
      </li>
    </ul>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[12, 24, 60, 120]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import vehicleAPI from '@/api/vehicleAPI'
import commonAPI from '@/api/commonAPI'
import dayjs from 'dayjs'
export default {
  props: {
    carTypeDict: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      picList: [],
      params: [],
      offset: 0,
      limit: 12,
      total: 0
    }
  },
  created () {
  },
  mounted () {
    this.getPicList()
  },
  methods: {
    handleSizeChange (size) {
      this.limit = size
      this.offset = 0
      this.getPicList(this.params)
    },
    handleCurrentChange (page) {
      this.offset = page - 1
      this.getPicList(this.params)
    },
    getPicList (params, clickSearch) {
      if (clickSearch) this.offset = 0
      this.params = params
      vehicleAPI.queryListByParams(this.offset, this.limit, params).then(res => {
        res.data.payload.rows.forEach(item => {
          item.file_list = item.file_list && JSON.parse(item.file_list)
          if (item.car_type) {
            const carTypeDict = this.carTypeDict.find(value => value.detailValue === item.car_type.toString())
            item.carTypeDisplay = carTypeDict ? carTypeDict.detailName : '-'
          }
          if (item.collect_time) {
            item.collect_time = dayjs(item.collect_time).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        this.picList = res.data.payload.rows
        this.total = res.data.payload.total
      })
    },
    downloadFile (id) {
      return commonAPI.downloadFile(id)
    },
    download (id) {
      const a = document.createElement('a')
      a.href = this.downloadFile(id)
      a.setAttribute('download', true)
      a.click()
    }
  }
}
</script>

<style lang="less" scoped>
.vehicle-pic-list {
  height: calc(100% - 150px);
  margin-top: 30px;
  overflow: scroll;
  ul {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .picLi {
    width: 16%;
    // flex: 1;
    flex-shrink: 0;
    margin:  0 0 30px;
    .pic {
      width: 100%;
      height: 200px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      margin: 0;
      font-size: 16Px;
      color: #fff;
    }
    .info {
      height: 32px;
      padding: 5px;
      line-height: 32px;
      .text {
        font-size: 16Px;
        color: #fff;
      }
    }
  }
  .page {
    text-align: right;
  }
}
</style>