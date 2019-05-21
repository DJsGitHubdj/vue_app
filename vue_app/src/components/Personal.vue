<template>
  <div>
    <mu-appbar class="title" title="个人中心"></mu-appbar>
    <div class="person">
      <div class="person-info">
        <img :src="avatar_url" alt="person">
        <div class="person-name">
          <span>{{loginname}}</span>
          <mu-button class="login-out" color="#1c6132" @click="loginOut()">退出登陆</mu-button>
        </div>
      </div>
      <div class="score">积分：{{loginData.score}}</div>
      <div class="created-time">注册时间：{{loginData.create_at | timeago}}</div>
    </div>
    <div class="person-recent">
      <div class="info-title">最近创建的话题</div>
      <div class="topics-content">
        <div v-if="loginData.recent_topics.length > 0">
          <div v-for="(item,index) in loginData.recent_topics" :key="index">
            <router-link
              v-for="(item,index) in loginData.recent_topics"
              :key="index"
              :to="{path:'/Details',query:{id:item.id}}"
              tag="div"
              class="replies-content"
            >
            <span>
              <img :src="item.author.avatar_url" alt="author">
            </span>
            <span class="replies-title">{{item.title}}</span>
            <span>{{item.last_reply_at | timeago}}</span>
            </router-link>
          </div>
        </div>
        <div v-else>无话题</div>
      </div>
      <div class="info-title">最近参与的话题</div>
      <div class="topics-content">
        <div v-if="loginData.recent_replies.length > 0">
          <router-link
            v-for="(item,index) in loginData.recent_replies"
            :key="index"
            :to="{path:'/Details',query:{id:item.id}}"
            tag="div"
            class="replies-content"
          >
            <span>
              <img :src="item.author.avatar_url" alt="author">
            </span>
            <span class="replies-title">{{item.title}}</span>
            <span>{{item.last_reply_at | timeago}}</span>
          </router-link>
        </div>
        <div v-else>无话题</div>
      </div>
    </div>

    <Bottom_nav></Bottom_nav>
  </div>
</template>
<script>
import axios from "axios";
import timeago from "timeago.js";
import Bottom_nav from "@/components/common/Bottom_nav";

export default {
  name: "Personal",
  components: { Bottom_nav },
  data() {
    return {
      avatar_url: "",
      loginname: "",
      loginData: {
        recent_topics: [],
        recent_replies: []
      }
    };
  },
  created() {
    this.getData();
  },
  filters: {
    timeago(val) {
      let time = new Date(val);
      //实例化timeago函数
      let funTime = timeago();
      return funTime.format(time, "zh_CN"); //将UTC时间转换格式, zh_CN 是中文格式
    }
  },
  methods: {
    getData() {
      //console.log(this.$route.query.id);
      let accesstoken =
        localStorage.getItem("accesstoken") || this.$route.query.id;
      axios
        .post("https://www.vue-js.com/api/v1/accesstoken", {
          accesstoken: accesstoken
        })
        .then(response => {
          //console.log(response.data)
          this.avatar_url = response.data.avatar_url;
          this.loginname = response.data.loginname;
          //一定要在登陆成功后再请求登陆者信息，这是一个先后逻辑。
          this.getLoginData();
        })
        .catch(error => {
          console.log("连接失败" + error);
        });
    },
    getLoginData() {
      axios
        .get("https://www.vue-js.com/api/v1/user/" + this.loginname)
        .then(response => {
          console.log(response.data.data);
          this.loginData = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    loginOut() {
      this.accesstoken = "";
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("loginname");
      this.$router.push({
        path: "/index"
      });
    }
  }
};
</script>
<style scoped>
.title {
  background: #1c6132;
  text-align: center;
  color: #fff;
}
.person {
  margin: 24px 12px 0 12px;
  padding: 12px 14px;
  background: #fff;
}
.person-info {
  display: flex;
  margin-bottom: 12px;
}
.person-info img {
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 20px;
}
.person-name {
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding-top: 6px;
  font-size: 16px;
  color: #778087;
}
.created-time {
  padding: 10px 0;
  color: #778087;
}
.person-recent {
  margin: 0 12px 60px 12px;
}
.info-title {
  padding: 10px;
  color: #1c6132;
  background: #f6f6f6;
  border-radius: 3px;
}
.topics-content {
  padding: 10px;
  background: #fff;
  height: auto;
  overflow: scroll;
}
.replies-content {
  padding: 12px 0;
  color: #778087;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d5d5d5;
}
.replies-content img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
.replies-title {
  flex: 1;
  overflow: hidden;
  color: #08c;
}
</style>



