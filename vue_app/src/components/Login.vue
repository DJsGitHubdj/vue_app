<template>
  <div class="wrapper">
    <mu-appbar class="title" title="主页/登录"></mu-appbar>
    <div class="form">
      <mu-text-field v-model="val" label="Access Token" :errorText="error" label-float/>
      <br>
      <mu-button @click="login" color="primary" full-width>登录</mu-button>
    </div>
    <Bottom_nav></Bottom_nav>
  </div>
</template>

<script>
import axios from "axios";
import Bottom_nav from "@/components/common/Bottom_nav";
export default {
  name: "Login",
  components: {
    Bottom_nav
  },
  data() {
    return {
      val: "",
      error: ""
    };
  },
  methods: {
    login() {
      // Access Token: 'e8a700fd-a3e0-4122-8ef9-65618f563211'
      let that = this;
      axios
        .post("https://www.vue-js.com/api/v1/accesstoken", {
          accesstoken: that.val
        })
        .then(function(response) {
          console.log(response);
          that.error = "";
          localStorage.setItem("accesstoken", that.val);
          localStorage.setItem("loginname", response.data.loginname);
          //console.log(localStorage.getItem("accesstoken"));
          //console.log(that.$route.matched)
          that.$router.push({
            path: "/personal",
            query: {
              id: that.val
            }
          });
        })
        .catch(function(error) {
          that.error =
            "输入错误,需要在Vue.js中文社区登陆账号，生成的Access Token在设置页面下方";
          console.log(that.$route.matched);
          that.$route.matched[0].meta = {
            requiresAuth: true
          };
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  background: #1c6132;
  text-align: center;
  color: #fff;
}
.form {
  margin-top: 40%;
  padding: 14px;
  text-align: center;
}
</style>
