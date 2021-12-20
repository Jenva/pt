<template>
  <div class="side-bar" v-show="showModal">
    <div class="content" ref="modalContent">
      <window-top-title :title="title" class="title" @close="closeModal"></window-top-title>
      <div class="table">
        <slot></slot>
      </div>
      <div class="bottom-nav">
        <el-button size="small" @click="closeModal">关闭</el-button>
        <el-button type="primary" size="small" @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import windowTopTitle  from '@/components/windowTopTitle'
export default {
  props: {
    title: {
      type: String,
      default: '查看'
    }
  },
  components: {
    windowTopTitle
  },
  data () {
    return {
      showModal: false
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
    confirm () {
      this.$emit('confirm', this.closeModal)
    },
    closeModal () {
      setTimeout(() => {
        this.$refs.modalContent.classList = 'content'
      })
      setTimeout(() => {
        this.showModal = false
      }, 600)
      this.$emit('close')
    }
  }
}
</script> 

<style lang="less" scoped>
#dark {
  .side-bar {
    .content {
      background: #21232d;
      .title {
        border-top: 1px dashed #13585c;
        border-bottom: 1px dashed #13585c;
      }
      .bottom-nav {
        border-top: 1px solid #13585c;
        border-bottom: 1px solid #13585c;
      }
    }
  }
}
#light {
  .side-bar {
    .content {
      background: #EBF2FA;
      .title {
        border-top: 1px dashed #2491F6;
        border-bottom: 1px dashed #2491F6;
      }
      .bottom-nav {
        border-top: 1px solid #2491F6;
        border-bottom: 1px solid #2491F6;
      }
    }
  }
}
.side-bar {
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
    // background: #21232d;
    transition: right 0.8s;
    padding-bottom: 60px;
    // .title {
    //   border-top: 1px dashed #13585c;
    //   border-bottom: 1px dashed #13585c;
    // }
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
      // border-top: 1px solid #13585c;
      // border-bottom: 1px solid #13585c;
      line-height: 60px;
    }
  }
  .content.show {
    right: 0;
  }
}
</style>