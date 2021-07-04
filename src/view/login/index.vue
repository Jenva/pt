<template>
  <div class="login">
    <div class="login-message">
      <div class="login-title">
        <div class="logo"></div>
        <h1>视频监控分析平台</h1>
      </div>
      <div class="logo-form">
        <el-form :model="formData">
          <el-form-item>
            <el-select placeholder="请输入地址" v-model="formData.address" style="width: 100%" filterable>
              <img src="../../assets/login/login_icon_address_normal.png" alt="" slot="prefix">
              <el-option value="a" label="24.151.2.1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入用户名" v-model="formData.userName">
              <img src="../../assets/login/login_icon_username_normal.png" alt="" slot="prefix">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入密码" v-model="formData.password">
              <img src="../../assets/login/login_icon_password_normal.png" alt="" slot="prefix">
            </el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {}
    }
  },
  methods: {
    login () {
      this.$store.commit('changeLogined', true)
      // window.sessionStorage.setItem('logined', true)
      const bykj = window.bykj
      const cxxNotifier = (cmd, msg) => {
        console.log('js received:' + cmd + ' body:' + msg);
        bykj.frameCall('test',msg);  
        if(cmd=='userpswd'){
          //send login response to c++
          let jsonBody = {
            uri:'',
            sql:'127.0.0.1;9394;test;test;dbha2;',
            name:'管理员'
          };
          // bykj.saveToken('true')
          let jsonstr = JSON.stringify(jsonBody);
          console.log(jsonstr)
          bykj.frameCall('logined',jsonstr);  
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

<style lang="less" scoped>
.login {
  height: 100%;
  background: url('../../assets/login/login_img_bg_normal.png');
  background-size: 100% 100%;
  text-align: center;
  overflow: hidden;
  .login-message {
    position: fixed;
    top: 50%;
    right: 35px;
    width: 30%;
    transform: translateY(-50%);
  }
  .login-title {
    display: flex;
    justify-content: center;
    margin-bottom: 39px;
    .logo {
      width: 150px;
      height: 50px;
      background: url('../../assets/login/login_img_logo_normal.png');
      background-size: 100% 100%;
      vertical-align: middle;
    }
    h1 {
      flex: 1;
      font-size: 46px;
      line-height: 46px;
      font-weight: 900;
      color: #fff;
    }
  }
  .logo-form {
    img {
      vertical-align: middle;
      height: 26px;
      margin-top: -4px;
    }
    .login-btn {
      width: 100%;
      margin-top: 4px;
    }
  }
}
</style>

<style lang="less">
.login {
  .el-input--prefix .el-input__inner {
    padding: 0 50px;
  }
  .el-input__prefix {
    left: 13px;
  }
  .el-input__inner {
    border: 1px solid #2d7f8e;
  }
}
</style>