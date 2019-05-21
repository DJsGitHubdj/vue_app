<template>
  <div>
    <mu-appbar class="title" title="消息"></mu-appbar>
    <div class="main">
      <mu-tabs
        color="#3bab5f"
        :value.sync="activeTab"
        @change="handleTabChange"
        full-width
        indicator-color="#1c6132"
      >
        <mu-tab>未读消息</mu-tab>
        <mu-tab>已读消息</mu-tab>
      </mu-tabs>
      <!-- 未读消息列表 -->
      <ul class="message-list" v-show="activeTab === 0">
        <router-link
          :to="{path:'/details',query:{id:item.topic.id}}"
          tag="li"
          class="message-item"
          v-for="item in unread_messages"
          :key="item.id"
        >
          <div class="author">
            <img :src="item.author.avatar_url" alt="user">
            <p>{{item.author.loginname}}</p>
          </div>
          <div class="content">
            <h3 v-html="item.reply.content"></h3>
            <p>来自：{{item.topic.title}}</p>
          </div>
          <div class="timer">
            <span>{{item.reply.create_at | timeago}}</span>
          </div>
        </router-link>
        <li v-if="!count" class="none_tip">暂无消息</li>
      </ul>
      <!-- 已读消息列表 -->
      <ul v-if="accesstoken" class="message-list" v-show="activeTab === 1">
        <router-link
          :to="{path:'/details',query:{id:item.topic.id}}"
          tag="li"
          class="message-item"
          v-for="item in read_messages"
          :key="item.id"
        >
          <div class="author">
            <img :src="item.author.avatar_url" alt="author">
          </div>
          <div class="content">
            <span>{{item.author.loginname}}</span> 在话题 <span>{{item.topic.title}}</span> 中@了你
          </div>
          <div v-if="item.reply.content" class="timer">
            {{item.reply.create_at | timeago}}
          </div>
        </router-link>
        <li v-if="!read_messages.length" class="none_tip">暂无消息</li>
      </ul>
      <p class="tips" v-if="!accesstoken">请先登录</p>
    </div>
    <Bottom_nav></Bottom_nav>
  </div>
</template>
<script>
import axios from "axios";
import timeago from "timeago.js";
import Bottom_nav from '@/components/common/Bottom_nav';
export default {
  name: "Message",
  components:{Bottom_nav},
  data() {
    return {
      activeTab: 0,
      accesstoken: "",
      count: null,
      unread_messages: [],
      read_messages: []
    };
  },
  created() {
    this.accesstoken = localStorage.getItem("accesstoken") || "";
    if (this.accesstoken) {
      this.getData();
    }
  },
  beforeMount() {
    //数据准备完毕后发现没有未读消息就切换到已读tab栏
    if (!this.count) {
      this.activeTab = 1;
    }
  },
  filters: {
    timeago(val) {
      console.log(val);
      let time = new Date(val);
      let thistime = timeago();
      return thistime.format(time, "zh_CN");
    }
  },
  methods: {
    getData() {
      let that = this;
      axios
        .get(
          "https://www.vue-js.com/api/v1/messages?accesstoken=" +
            this.accesstoken
        )
        .then(function(response) {
          that.unread_messages = response.data.data.hasnot_read_messages;
          //console.log(response.data.data);
          that.read_messages = response.data.data.has_read_messages;
          //console.log(that.read_messages);
        });
      axios
        .get(
          "https://www.vue-js.com/api/v1/message/count?accesstoken=" +
            this.accesstoken
        )
        .then(function(response) {
          //获取未读消息数量
          that.count = response.data.data;
          console.log(that.count);
        });
    },
    handleTabChange(val) {
      //若果将所有tab向对应的内容放在一个容器里面，切换tab时可调用此函数来通过实参val的值来加载内容。
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
.main{
    margin-bottom: 60px;
}
.activeTab {
  position: relative;
  background: #1c6132;
}

.message-list {
  margin: 12px 0;
  padding: 10px;
  background: #fff;
}

.none_tip{
    margin-top: 20px;
    text-align: center;
}

.message-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #d5d5d5;
}

.author img {
  height: 40px;
  width: 40px;
  margin-right: 10px;
  border-radius: 50%;
}

.content {
  flex: 1;
}

.content span {
  color: #08c;
}

.content > p {
  color: #778890;
  font-size: 12px;
}

.timer {
  margin-left: 1rem;
  color: #778890;
}

.tips {
  padding: 1rem 0;
  text-align: center;
}
</style>


