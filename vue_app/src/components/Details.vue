<template>
  <div>
    <mu-appbar class="title" :title="content.title">
      <mu-button icon slot="left" @click="goback()">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>
    </mu-appbar>
    <div class="header">
      <div class="header-status">
        <div v-if="content.top">置顶</div>
        <div v-if="content.good">精华</div>
      </div>
      <div class="header-title">{{content.title}}</div>
      <mu-checkbox
        v-model="isChecked"
        :label="collect_tip"
        class="demo-checkbox"
        uncheckIcon="favorite_border"
        checkedIcon="favorite"
      />
    </div>
    <div class="sub-header">
      <span>发布于{{content.create_at | timeago}}</span>
      <span>作者:{{content.author.loginname}}</span>
      <span>{{content.visit_count}}次浏览</span>
      <span>来自:{{content.tab | tab}}</span>
    </div>
    <!-- 内容区 -->
    <div class="contain" v-html="content.content">
      <!-- {{content.content}} -->
    </div>
    <!-- 评论区 -->
    <div v-if="content.replies.length > 0" class="replies">
      <div class="replies-count">{{content.replies.length}}条回复</div>
      <ul class="replies-list">
        <li class="reply-item" v-for="(item,index) in content.replies" :key="index">
          <div class="reply-info">
            <!-- 头像 -->
            <router-link
              :to="{path:'/user',query:{user:item.author.loginname}} "
              :src="item.author.avatar_url"
              tag="img"
            ></router-link>
            <div class="reply-info-time">
              <span>{{item.author.loginname}}</span>
              <span>{{index+1+'楼'}}•{{item.create_at | timeago}}</span>
            </div>
            <div class="handle-bar">
              <mu-button icon @click="thumb(item)">
                <mu-icon value="thumb_up" size="16"></mu-icon>
                <span class="thumb-count">{{item.ups.length}}</span>
              </mu-button>
              <!-- 由于此模块文件过大(超过了所谓的300行代码原则)，此处不引用marked和mavon-editor,要使用此功能见Publish模块 -->
              <mu-button icon @click="reply(item)">
                <mu-icon value="input" size="16"></mu-icon>
              </mu-button>
            </div>
          </div>
          <div class="reply-text" v-html="item.content"></div>
        </li>
      </ul>
    </div>
    <!-- 登陆提示框 -->
    <mu-dialog v-if="!accesstoken" :open.sync="login_dialog" title="提示：">
      请先登录，登录后即可点赞。
      <mu-button slot="actions" @click="login_dialog = false" primary>取消</mu-button>
      <mu-button slot="actions" @click="goLogin()" color="primary">去登陆</mu-button>
    </mu-dialog>

    <!-- 回复提示框 -->
    <mu-dialog class="reply_reply" title="回复" width="100%" :open.sync="openSimple">
      <textarea class="reply_reply_textarea" rows="4" v-model="reply_reply_value"></textarea>
      <mu-button slot="actions" flat color="primary" @click="openSimple = false">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="reply_reply()">回复</mu-button>
    </mu-dialog>
    <!-- 回复区 -->
    <div class="replies">
      <div class="replies-count">添加回复</div>
      <textarea rows="6" v-model="add_reply_value"></textarea>
      <mu-button class="reply-btn" color="primary" @click="add_reply()">回复</mu-button>
    </div>
    <mu-alert color="success" @delete="alert = false" delete v-if="alert">
      <mu-icon left value="check_circle"></mu-icon>
      {{tip_text}}
    </mu-alert>
  </div>
</template>
<script>
import axios from "axios";
import timeago from "timeago.js";
export default {
  name: "Detalis",
  data() {
    return {
      accesstoken: "",
      api: "https://www.vue-js.com/api/v1/topic/",
      content: {
        //当数据有多层级时，最好要预先在内部声明一个空容器，否则会undefined
        author: {},
        replies: []
      },
      collect_tip: "加入收藏",
      isChecked: false,
      openSimple: false,
      login_dialog: false,
      reply_reply_value: "",
      reply_id: "",
      add_reply_value: "",
      //回复成功提示
      alert: false,
      tip_text: "回复成功！"
    };
  },
  created() {
    this.accesstoken = localStorage.getItem("accesstoken") || "";
    this.loginname = localStorage.getItem("loginname") || "";
    this.getData();
  },
  methods: {
    getData() {
      let id = this.$route.query.id;
      //console.log(id)
      let that = this;
      axios.get(this.api + id).then(response => {
        that.content = response.data.data;
        that.loginName = response.data.data.author.loginname;
        //console.log(that.content);
      });
    },
    goback() {
      this.$router.go(-1);
    },
    thumb(item) {
      let that = this;
      axios
        .post("https://www.vue-js.com/api/v1/reply/" + item.id + "/ups", {
          accesstoken: that.accesstoken
        })
        .then(function(response) {
          console.log(response.data);
          if (response.data.error_msg) {
            that.tip_text = response.data.error_msg;
            that.alert = true;
          }
          that.getData();
        });
    },
    goLogin() {
      this.login_dialog = false;
      this.$router.push({ path: "/login" });
    },
    reply(item) {
      if (this.accesstoken) {
        this.openSimple = true;
        this.reply_id = item.id;
        //console.log("需要回复给" + item.id);
      } else {
        this.login_dialog = true;
      }
    },
    add_reply() {
      console.log("回复给" + this.$route.query.id);
      let that = this;
      axios
        .post(
          "https://www.vue-js.com/api/v1/topic/" +
            this.$route.query.id +
            "/replies",
          {
            accesstoken: that.accesstoken,
            content: that.add_reply_value
          }
        )
        .then(function(response) {
          that.tip_text = "成功添加回复！";
          that.alert = true;
          that.getData();
          that.add_reply_value = "";
        });
    },
    reply_reply() {
      console.log(this.reply_id);
      let id = this.$route.query.id;
      let that = this;
      axios
        .post("https://www.vue-js.com/api/v1/topic/" + id + "/replies", {
          accesstoken: this.accesstoken,
          content: this.reply_reply_value,
          reply_id: this.reply_id
        })
        .then(function(response) {
          that.openSimple = false;
          console.log("已经回复给" + that.reply_id);
          that.tip_text = "回复成功！";
          that.alert = true;
          that.getData();
          that.reply_reply_value = "";
        });
    },
    collect_true() {
      let that = this;
      axios
        .post("https://www.vue-js.com/api/v1/topic/collect", {
          accesstoken: that.accesstoken,
          topic_id: this.$route.query.id
        })
        .then(response => {
          // console.log(response.data)
          console.log("收藏成功！");
        });
    },
    collect_false() {
      let that = this;
      axios
        .post("https://www.vue-js.com/api/v1/topic/de_collect ", {
          accesstoken: this.accesstoken,
          topic_id: this.$route.query.id
        })
        .then(function(response) {
          // console.log(response.data)
          console.log("已经取消收藏");
        });
    }
  },
  filters: {
    timeago(val) {
      let time = new Date(val);
      let thistime = timeago();
      return thistime.format(time, "zh_CN");
    },
    tab(val) {
      if (val === "share") {
        return "分享";
      } else if (val === "ask") {
        return "问答";
      } else if (val === "job") {
        return "招聘";
      }
    }
  },
  watch: {
    isChecked(oldValue, newValue) {
      //console.log(oldValue, newValue);
      if (oldValue) {
        this.collect_tip = "取消收藏";
        this.collect_true();
      } else {
        this.collect_tip = "加入收藏";
        this.collect_false();
      }
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
.header {
  display: flex;
  padding: 12px 14px;
}
.header-status div {
  width: 36px;
  margin-left: 10px;
  margin-right: 8px;
  background-color: #009688;
  color: #fff;
  padding: 0.2rem;
  border-radius: 0.2rem;
}
.header-title {
  font-size: 18px;
  font-weight: bold;
  flex: 1;
  overflow: hidden;
}
.demo-checkbox {
  min-width: 80px;
  background: #e5e5e5;
  padding-right: 4px;
  color: #009688;
}
.demo-checkbox .mu-checkbox-label {
  color: #fff !important;
}
.sub-header {
  padding: 12px 14px;
  padding-top: 0;
  border-bottom: 1px solid #d5d5d5;
}
.sub-header span:before {
  content: "•";
  margin: 0 2px;
  font-size: 16px;
}
.contain {
  padding: 12px 14px;
}
/* v-html中的内容不受scope的样式约束，需要深层追踪，使用 >>> 或 /deep/来解决*/
.contain >>> img {
  height: auto;
  max-width: 100%;
  vertical-align: middle;
}
.contain /deep/ h4 {
  padding: 2px 0;
  margin-bottom: 8px;
  border-bottom: 1px solid #d5d5d5;
}
.replies {
  padding: 12px 0;
}
.replies-count {
  color: #009688;
  background: #f6f6f6;
  padding: 12px 14px;
}
.reply-item {
  padding: 12px 14px;
  border-top: 1px solid #d5d5d5;
}
.reply-item:first-child {
  background: #f4fcf0;
}
.reply-item:nth-child(2) {
  background: #f4fcf0;
}
.reply-info {
  display: flex;
}
.reply-info img {
  width: 40px;
  height: 40px;
}
.reply-info-time {
  flex: 1;
  margin-left: 12px;
}
.reply-info-time span:last-child {
  color: #08c;
}
.thumb-count {
  color: #333;
  font-size: 16px;
  margin: 0 2px;
}
.handle-bar .mu-icon-button {
  width: auto;
  padding: 0;
  height: auto;
  color: #778;
}
.reply-text {
  padding-top: 10px;
  margin-bottom: 14px;
}
.reply-text >>> img {
  max-width: 100%;
}
.replies textarea {
  display: block;
  width: 90%;
  margin: 12px 5%;
  border: 1px solid #e5e5e5;
}
.reply_reply_textarea {
  width: 100%;
}
.reply-btn {
  margin-left: 14px;
}
/* 同样的，直接给ui控件设置样式无效，需要设置一个父元素对象深层追踪 */
.reply_reply >>> .mu-dialog-title {
  font-size: 16px;
  padding: 16px 14px 10px 14px;
  color: #009688;
}
.mu-alert {
  position: fixed;
  width: 80%;
  left: 10%;
  right: 10%;
  bottom: 30%;
}
</style>


