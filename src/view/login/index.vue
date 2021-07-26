<template>
  <div class="login">
    11
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {}
    }
  },
  mounted () {
    this.login()
  },
  methods: {
    login () {
      // this.$store.commit('changeLogined', true)
      // window.sessionStorage.setItem('logined', true)
      const bykj = window.bykj
      const cxxNotifier = (cmd, msg) => {
        console.log('js received:' + cmd + ' body:' + msg);
        bykj.frameCall('test',msg);  
        if(cmd=='userpswd'){
          //send login response to c++
          let jsonBody = {
            uri: '',
            sql:'10.10.220.143;9394;test;test;dbha2;',
            // sql:'192.168.1.180;9394;test;test;dbha2;',
            name:'管理员'
          };
          let jsonstr = JSON.stringify(jsonBody);
          console.log(jsonstr)
          bykj.frameCall('logined',jsonstr);  
          window.bykj && bykj.saveToken('true')
          //_frameCall('logined',jsonstr);              		
        }
      }
      //register c++ callback function
      bykj.frameRegister(cxxNotifier)
      //_frameRegister(cxxNotifier);
      //获取用户 密码 
      bykj.frameCall('userpswd','{}')
    }
  }
}
</script>