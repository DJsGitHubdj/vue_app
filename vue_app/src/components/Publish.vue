<template>
  <div>
    <mu-appbar class="title" title="发布话题"></mu-appbar>
    <div class="main">
      <!-- 新版本muse设置不来color和 默认值-->
      <mu-select
        label="板块选择："
        v-model="selected_option"
        label-float
        color="primary"
        underline-color="#1c6132"
        full-width
      >
        <mu-option v-for="(option,index) in options" :key="index" :label="option" :value="option"></mu-option>
      </mu-select>
      <mu-text-field
        v-model="title"
        label="标题："
        label-float
        help-text="标题字数 10字以上"
        full-width
        underline-color="#1c6132"
      />
      <div class="markDown">
        <mavon-editor
          ref="md"
          v-model="context"
          :subfield="false"
          :toolbars="toolbars"
          @keydown="publish()"
          @imgAdd="imgAdd"
        />
      </div>
      <mu-button color="#1c6132" @click="publish()">提交</mu-button>
    </div>
    <Bottom_nav></Bottom_nav>
  </div>
</template>
<script>
import Bottom_nav from "@/components/common/Bottom_nav";
import axios from "axios";
import marked from "marked";
import { format } from "path";
export default {
  name: "Publish",
  components: { Bottom_nav },
  data() {
    return {
      options: ["分享", "问答", "招聘"], //目前api只有这三项
      selected_option: "",
      title: "",
      //markdown配置项
      context: " ", //输入的数据
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: false, // 标题
        underline: false, // 下划线
        mark: false, // 标记
        superscript: false, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: false, // 帮助
        code: true, // code
        subfield: false, //如果不要分栏，通常应该到html的mavon-editor标签上设置:subfield="false"
        fullscreen: true, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        /* 1.3.5 */
        undo: false, // 上一步
        trash: false, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        //上传文件列表
        img_file: ""
      }
    };
  },
  created() {
     var $vm = this;
  },
  methods: {
    publish() {
      console.log(this.selected_option);
      console.log(this.title);
      //将markdown绑定的内容转换为HTML格式,此处引用了marked
      this.context = marked(this.context);
      console.log(this.context);
      //将选项转换为api接受的值--之前传的汉字一直报422
      if (this.selected_option == "问答") {
        this.selected_option = "ask";
      }
      if (this.selected_option == "分享") {
        this.selected_option = "share";
      }
      if (this.selected_option == "招聘") {
        this.selected_option = "job";
      }
      var that = this;
      let accesstoken = localStorage.getItem("accesstoken");
      axios
        .post("https://www.vue-js.com/api/v1/topics", {
          accesstoken: accesstoken,
          title: this.title,
          tab: this.selected_option,
          content: this.context
        })
        .then(response => {
          console.log(response);
          that.title = "";
          that.selected_option = "";
        });
    },
    //暂无此接口
    imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("image", $file);
      console.log(formdata)
      axios({
        url: "server url",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" }
      }).then(url => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        // $vm.$img2Url 详情见本页末尾
        $vm.$img2Url(pos, url);
      });
    }
  },
  filters: {}
};
</script>
<style scoped>
.title {
  background: #1c6132;
  text-align: center;
  color: #fff;
}
.main {
  margin: 20px 12px 60px 12px;
  padding: 12px;
  background: #fff;
}
.main >>> .mu-input.has-label .mu-input-label.float {
  color: #1c6132;
}
.markDown {
  margin-top: 20px;
  margin-bottom: 20px;
}
.markDown>>>.v-note-wrapper .v-note-op .v-right-item{
  max-width: 8%;
}
</style>


