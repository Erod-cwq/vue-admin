<template>
<div class="login-form">
  <a-form-model
      ref="loginForm"
      :model="formInline"
      :rules="rules"
      layout="vertical"
      @keyup.enter.native="handleSubmit">
    <a-form-model-item>
      <a-input v-model="formInline.username" placeholder="Username">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-input v-model="formInline.password" type="password" placeholder="Password">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-button
          type="primary"
          html-type="submit"
          :block="true"
          @click="handleSubmit"
      >
       登录
      </a-button>
    </a-form-model-item>
  </a-form-model>
</div>
</template>
<script>
import {mapActions} from "vuex";

export default {
  name: 'Login',
  data() {
    return {
      formInline: {
        username: '',
        password: '',
        authcode: null
      },
      rules:{
        username: [{ required: true, message: '* 用户名/邮箱不能为空', trigger: ['change'] }],
        password: [{ required: true, message: '* 密码不能为空', trigger: ['change'] }],
      },
      labelCol: { span: 4},
      wrapperCol: { span: 14 }
    };
  },
  methods: {
    ...mapActions(['login']),
    handleSubmit() {
      const _this = this
      _this.$refs.loginForm.validate(valid =>{
        if(valid){
          _this.login(_this.formInline)
          .then(()=>{
            _this.$emit('success')
            _this.onLoginSucceed()
          }).catch(()=>{
            this.$message.warn("用户名或密码不正确")
          })
        }
      })
    },
    onLoginSucceed(){
      if(this.$route.query.redirect){
        this.$router.replace(this.$route.query.redirect)
      }else {
        this.$router.replace({name:'Post'})
      }

    }
  },
};
</script>
<style>
.login-form {
  background: #ffffff;
  position: absolute;
  border-radius: 5px;
  top: 45%;
  left: 50%;
  margin: -160px 0 0 -160px;
  width: 320px;
  padding: 18px 28px 28px 28px;
  box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);
  text-align: center}
</style>

