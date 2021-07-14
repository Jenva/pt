<template>
  <div class="preView">
    <div class="bigPic">
      <img :src="downloadFile(picList[selectedIndex].fileList[1])" alt="">
    </div>
    <div class="picList">
      <div class="picCell" v-for="(pic, index) in picList" :key="pic.id" @click="selectPic(index)">
        <div :class="{heightLight: index === selectedIndex}" style="width: 150px;height: 100%">
          <img :src="downloadFile(pic.fileList[0])" alt="" >
        </div>
        <!-- index ==== selectedIndex ? 'heightLight' : '' -->
      </div>
    </div>
  </div>
</template>

<script>
import commonAPI from '@/api/commonAPI'
export default {
  props: {
    picList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectedPic: '',
      selectedIndex: 0,
      // picList: [
      //   'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/738b4710b912c8fca7aea61dfc039245d7882184.jpg',
      //   'https://img2.baidu.com/it/u=2695676740,2371182110&fm=26&fmt=auto&gp=0.jpg',
      //   'https://img2.baidu.com/it/u=3179293169,86707758&fm=26&fmt=auto&gp=0.jpg',
      //   'https://img2.baidu.com/it/u=3854887086,4146495681&fm=26&fmt=auto&gp=0.jpg',
      //   'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/738b4710b912c8fca7aea61dfc039245d7882184.jpg',
      //   'https://img2.baidu.com/it/u=2695676740,2371182110&fm=26&fmt=auto&gp=0.jpg',
      //   'https://img2.baidu.com/it/u=3179293169,86707758&fm=26&fmt=auto&gp=0.jpg',
      //   'https://img2.baidu.com/it/u=3854887086,4146495681&fm=26&fmt=auto&gp=0.jpg',
      //   'https://img2.baidu.com/it/u=3179293169,86707758&fm=26&fmt=auto&gp=0.jpg',
      //   'https://img2.baidu.com/it/u=3854887086,4146495681&fm=26&fmt=auto&gp=0.jpg',
      //   'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/738b4710b912c8fca7aea61dfc039245d7882184.jpg',
      //   'https://img2.baidu.com/it/u=2695676740,2371182110&fm=26&fmt=auto&gp=0.jpg',
      //   'https://img2.baidu.com/it/u=3179293169,86707758&fm=26&fmt=auto&gp=0.jpg',
      //   'https://img2.baidu.com/it/u=3854887086,4146495681&fm=26&fmt=auto&gp=0.jpg'
      // ],
    }
  },
  methods: {
    selectPic (index) {
      this.selectedIndex = index
    },
    downloadFile (id) {
      return commonAPI.downloadFile(id)
    }
  }
}
</script>

<style lang="less">
.preView {
  .bigPic {
    height: 650px;
    overflow: hidden;
    text-align: center;
    margin-bottom: 20px;
    img {
      height: 100%;
    }
    // display: flex;
    // white-space:nowrap;
    // .pic {
    //   display: inline-block;
    //   width: 70%;
    //   height: 100%;
    //   position: relative;
    //   left: 50%;
    //   transform: translate(-50%);
    //   img {
    //     width: 100%;
    //     height: auto;
    //   }
    // }
  }
  .picList {
    display: flex;
    white-space:nowrap;
    overflow: auto;
    .picCell {
      flex-shrink: 0;
      // width: 10%;
      height: 100px;
      overflow: hidden;
      padding: 5px;
      img {
        height: 100%
      }
    }
  }
}
.heightLight {
  border: 1px solid red;
}
// .is-in-stage {
//   transform: translateX(-50%) scale(1)!important;
//   left: 50%!important;
// }
</style>