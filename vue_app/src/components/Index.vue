<template>
  <div>
    <Header class="header"></Header>
    <!-- muse-ui 3.0突然不支持响应式tab了，找了好久没找到办法 -->
    <mu-tabs
      class="tabs"
      :value.sync="activeTab"
      color="#d6d6d6"
      indicator-color="#1c6132"
      @change="handleTabChange"
      full-width
    >
      <mu-tab value="all">全部</mu-tab>
      <mu-tab value="good">精华</mu-tab>
      <mu-tab value="weex">weex</mu-tab>
      <mu-tab value="share">分享</mu-tab>
      <mu-tab value="ask">问答</mu-tab>
      <mu-tab value="job">招聘</mu-tab>
    </mu-tabs>
    <div ref="container" class="demo-loadmore-content">
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
        <mu-list>
          <!-- 这里不用mu-list-item，自带样式太多，懒得去审查元素改，不如自己写 -->
          <div v-for="(item,index) in sections" :key="index" class="section-list">
            <router-link
              :to="{path:'/user',query:{user:item.author.loginname}}"
              :src="item.author.avatar_url"
              tag="img"
              alt="user"
            ></router-link>
            <router-link :to="{path:'/details',query:{id:item.id}}" tag="div" class="content">
              <div class="list_title">
                <span v-if="item.top">置顶</span>
                <span v-else-if="item.good">精华</span>
                <span v-else-if="item.tab === 'share'" :style="styleShare">分享</span>
                <span v-else-if="item.tab === 'weex'" :style="styleObj">weex</span>
                <span v-else-if="item.tab === 'ask'" :style="styleObj">问答</span>
                <span v-else-if="item.tab === 'job'" :style="styleJob">招聘</span>

                <span v-else :style="styleObj">未知</span>
              </div>
              <div class="timer-right">
                <div class="title-text">{{item.title}}</div>
                <div class="timer">
                  <span>{{item.reply_count}} / {{item.visit_count}}</span>
                  <span>{{item.last_reply_at | timeago}}</span>
                </div>
              </div>
            </router-link>
          </div>
        </mu-list>
      </mu-load-more>
    </div>
  <Bottom_nav ></Bottom_nav> 
  </div>
</template>
<script>
//引入axios 和timeago.js
import axios from "axios";
import timeago from "timeago.js";
//引入header模块
import Header from "@/components/common/Header";
import  Bottom_nav from '@/components/common/Bottom_nav';
export default {
  name: "Index",
  components: {
    Header,
    Bottom_nav
  },
  data() {
    return {
      activeTab: "all",
      styleObj: {
        backgroundColor: "#d5d5d5"
      },
      styleShare: {
        color: "#087e5e",
        backgroundColor: "#d5d5d5"
      },
      styleJob: {
        backgroundColor: "#ff2e50"
      },
      sections: [],
      api: "https://www.vue-js.com/api/v1/topics?tab=all",
      refreshing: false,
      loading: false,
      pageIndex: 1,
      loadedAll: false //是否加载完毕
    };
  },
  created() {
    //首次默认加载全部类型
    this.getData();
  },
  methods: {
    handleTabChange(val) {
      console.log(val);
      this.activeTab = val;
      this.api = "https://www.vue-js.com/api/v1/topics?tab=" + val;
      this.getData();
    },
    getData() {
      let that = this;
      //如果不传page参数，api默认取第一页数据(后台每页默认20条)
      // 'https://www.vue-js.com/api/v1/topics?tab=all'+'&page=' + this.pageIndex
      axios.get(this.api).then(function(response) {
        //console.log(response.data)
        that.sections = response.data.data;
        console.log(that.sections);
      });
    },
    refresh() {
      this.refreshing = true;
      this.$refs.container.scrollTop = 0;
      //可以不要setTimeout模拟异步，请求数据本来就是异步，这里方便演示
      setTimeout(() => {
        this.getData();
        this.refreshing = false;
        console.log("组件拖动已经触发刷新");
      }, 100);
    },
    load() {
      if (!this.loadedAll) {
        this.loading = true;
        this.pageIndex += 1;
        let url = this.api + "&page=" + this.pageIndex;
        let arr = [];
        setTimeout(() => {
          let that = this;
          axios.get(url).then(function(response) {
            arr = response.data.data;
            if (arr.length === 0) {
              that.loading = false;
              that.loadedAll = true;
              return;
            }
            //es6的数组操作，直接合并数组
            that.sections = [...that.sections, ...arr];
            console.log(that.sections);
          });
          console.log(this.pageIndex);
          //这句代码的位置很重要，它告诉ui结束一次下拉，不要连续
          this.loading = false;
        }, 100);
      }
    }
  },
  filters: {
    timeago(val) {
      let time = new Date(val);
      var thistime = timeago();
      return thistime.format(time, "zh_CN"); //将UTC时间转换格式---> 几天前,几小时前...
    }
  },
  computed: {}
};
</script>
<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}
.tabs {
  margin-top: 56px;
  display: flex;
  justify-content: space-between;
  color: #369219;
}
.section-list {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e5e5e5;
  overflow: hidden;
}
.section-list img {
  width: 40px;
  height: 40px;
}
.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.list_title > span {
  /*white-space:nowrap;*/
  display: inline-block;
  width: 36px;
  margin-left: 10px;
  margin-right: 8px;
  background-color: #009688;
  color: #fff;
  padding: 0.2rem;
  border-radius: 0.2rem;
}
.title-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.timer-right {
  overflow: hidden;
  flex-grow: 1;
}
.timer {
  display: flex;
  justify-content: space-between;
  color: #878798;
}
/* 移动设备友好顺滑 */
.demo-loadmore-content {
  -webkit-overflow-scrolling: touch;
}
</style>


