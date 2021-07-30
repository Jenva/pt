<template>
  <div class="dict">
    <div class="tree">
      <div class="tree-btn">
        <el-button @click="addTreeNode('treeAdd')">添加</el-button>
        <el-button @click="addTreeNode('treeEdit')">修改</el-button>
        <el-button @click="deleteDict">删除</el-button>
      </div>
      <el-tree :data="dictList" :props="defaultProps" @node-click="nodeClick"></el-tree>
    </div>
    <div class="treeDetail">
      <div class="btn">
        <el-button @click="showTreeDetailDialog('detailAdd')">添加</el-button>
      </div>
      <div class="treeList">
        <el-table :data="dictDetailList">
          <el-table-column label="名称" prop="detailName"></el-table-column>
          <el-table-column label="编码" prop="detailValue"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="showTreeDetailDialog('detailEdit', scope.row)">修改</el-button>
              <el-button @click="deleteDetailDict(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="treeDetailTitle"
      :visible="showDialog"
      @close="closeTreeDetailDialog"
      width="30%"
      :before-close="beforeClose"
    >
      <el-form :model="formData" ref="treeDetail" :rules="treeDetailRules" label-width="80px">
        <el-form-item label="名称" prop="detailName">
          <el-input v-model="formData.detailName" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="detailValue" >
          <el-input v-model="formData.detailValue" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" style="width: 90%">
            <el-option value="ACTIVE" label="启用"></el-option>
            <el-option value="ABANDON" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" style="width: 90%"></el-input>
        </el-form-item>
        <div class="form-btn">
          <el-button type="primary" @click="comfirnAddNode('treeDetail')">确定</el-button>
          <el-button @click="closeTreeDetailDialog">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible="showTreeDialog"
      @close="closeTreeDialog"
      width="30%"
      :before-close="beforeClose"
    >
      <el-form :model="treeData" :rules="treeRules" ref="treeForm" label-width="80px">
        <el-form-item label="名称" prop="dictName">
          <el-input v-model="treeData.dictName" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="dictValue">
          <el-input v-model="treeData.dictValue" style="width: 90%" :disabled="treeType !== 'treeAdd'"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="treeData.status" style="width: 90%">
            <el-option value="ACTIVE" label="启用"></el-option>
            <el-option value="ABANDON" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="treeData.remark" style="width: 90%"></el-input>
        </el-form-item>
      </el-form>
      <div class="form-btn">
        <el-button type="primary" @click="comfirnAddNode('tree')">确定</el-button>
        <el-button @click="closeTreeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonAPI from '@/api/commonAPI'
export default {
  data () {
    return {
      showDialog: false,
      showTreeDialog: false,
      currentId: 0,
      treeDetailTitle: '',
      title: '',
      treeType: '',
      dictValue: '',
      dictList: [],
      formData: {
        detailName: '',
        detailValue: '',
        status: '',
        remark: '',
      },
      dictDetailList: [],
      treeData: {},
      treeRules: {
        dictName: [
          { required: true, message: '名称不能为空' }
        ],
        dictValue: [
          { required: true, message: '编码不能为空' }
        ],
        status: [
          { required: true, message: '状态不能为空' }
        ]
      },
      treeDetailRules: {
        detailName: [
          { required: true, message: '名称不能为空' }
        ],
        detailValue: [
          { required: true, message: '编码不能为空' }
        ],
        status: [
          { required: true, message: '状态不能为空' }
        ]
      },
      defaultProps: {
        label: 'dictName'
      }
    }
  },
  mounted () {
    this.getDict()
  },
  methods: {
    nodeClick (data) {
      this.getDictByValue(data.dictValue)
      this.currentId = data.id
      this.dictValue = data.dictValue
    },
    deleteDict () {
      commonAPI.deleteDict(this.currentId).then()
    },
    addTreeNode (type) {
      this.showTreeDialog = true
      this.treeType = type
      if (type === 'treeEdit') {
        this.treeData = this.dictList.find(item => item.id === this.currentId)
        this.title = '修改'
      } else if (type === 'treeAdd') {
        this.title = '添加'
        this.treeData = {}
      }
    },
    editDict () {
      const params = Object.assign({}, this.treeData)
      commonAPI.editDict(this.currentId, params).then()
    },
    editDictDetail (id, params) {
      commonAPI.editDictDetail(id, params).then(() =>{
        this.closeTreeDetailDialog()
        this.getDict()
      })
    },
    showTreeDetailDialog (type, data) {
      this.showDialog = true
      this.treeType = type
      if (type === 'detailEdit') {
        this.formData = data
        this.treeDetailTitle = '修改'
      } else if (type === 'detailAdd') {
        this.formData = {}
        this.treeDetailTitle = '添加'
      }
    },
    getDictByValue (dictValue) {
      const parmas = {
        dictValue
      }
      commonAPI.getDictByValue(parmas).then(res => {
        this.dictDetailList = res.data.payload
      })
    },
    addDictDetail (params) {
      commonAPI.addDictDetail(params).then(() => {
        this.closeTreeDetailDialog()
        this.getDictByValue(this.dictValue)
      })
    },
    comfirnAddNode (type) {
      if (type === 'tree') {
        const params = Object.assign({}, this.treeData)
        this.$refs.treeForm.validate(valid => {
          if (valid) {
            commonAPI.addDict(params).then(() => {
              this.closeTreeDialog()
              this.getDict()
            })
          }
        })
      } else {
        const params = Object.assign({}, this.formData, { dictValue: this.dictValue })
        this.$refs.treeDetail.validate(valid => {
          if (!valid)  return            
          if (this.treeType === 'detailEdit') {
            this.editDictDetail(params.id, params)
          } else {
            this.addDictDetail(params)
          }
        })
      }
    },
    deleteDetailDict (id) {
      commonAPI.deleteDictDetail(id).then(() => {
        this.getDictByValue(this.dictValue)
      })
    },
    beforeClose (done) {
      if (this.$refs.treeForm) {
        this.$refs.treeForm.clearValidate()
      }
      if (this.$refs.treeDetail) {
        this.$refs.treeDetail.clearValidate()
      }
      done()
    },
    closeTreeDialog () {
      this.showTreeDialog = false
    },
    closeTreeDetailDialog () {
      this.showDialog = false
    },
    getDict () {
      commonAPI.getALLDict().then(res => {
        this.dictList = res.data.payload
      })
    }
  }
}
</script>

<style lang="less" scoped>
.dict {
  display: flex;
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
  background: #21232d;
  .tree {
    width: 300px;
    padding: 20px;
    margin-right: 24px;
    border: 1px solid #13485c;
    .tree-btn {
      margin-bottom: 20px;
    }
  }
  .treeDetail {
    flex: 1;
    padding: 20px;
    border: 1px solid #13585c;
    overflow: auto;
  }
  // .treeList {
  //   height: 100%;
  //   overflow: auto;
  // }
}
.form-btn {
  text-align: center;
}
</style>