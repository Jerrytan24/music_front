<template>
  <div class="MyHeader">
    <div class="main-content">
      <!-- 左边导航 -->
      <div class="header-left">
        <span> Small Music</span>
        <ul>
          <li><router-link to="/index" ref="index">首页</router-link></li>
          <li><router-link to="/songList" ref="songList">歌单</router-link></li>
          <li><router-link to="/singer" ref="singerList">歌手</router-link></li>
          <li><router-link to="/favor" ref="myMusic">我的音乐</router-link></li>
        </ul>
      </div>
      <!-- 中间搜索模块 -->
      <div class="header-search">
        <el-input v-model="keyword" placeholder="请输入搜索内容"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="onSearch"
          >搜索</el-button
        >
      </div>
      <!-- 右面用户信息和下拉菜单 -->
      <div class="author-right">
        <el-dropdown @command="handleCommand" @visible-change="handleToggle">
          <span class="el-dropdown-link">
            <!-- 头像 -->
            <div class="authorMsg" @click="goLogin">
              <img v-lazy="authorImg" />
            </div>
            <!-- 昵称 -->
            <div class="nickname">{{ username }}</div>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="我的主页"
              ><i class="dropdown-icon"></i>我的主页
              <el-badge
                class="markicon"
                :value="numberReplyMessage"
                :max="99"
                v-if="numberReplyMessage != 0"
              />
            </el-dropdown-item>
            <el-dropdown-item command="我的私信"
              ><i class="dropdown-icon"></i>我的私信
              <el-badge
                class="markicon"
                :value="numberPriMsg"
                :max="99"
                v-if="numberPriMsg != 0"
              />
            </el-dropdown-item>
            <el-dropdown-item command="分享云村"
              ><i class="dropdown-icon"></i>分享云村</el-dropdown-item
            >
            <el-dropdown-item command="退出登录" v-show="flagLogin"
              ><i class="dropdown-icon"></i>退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 消息 -->
      <el-drawer
        title="我的私信"
        :visible.sync="drawer"
        size="28%"
        @closed="closed"
        v-if="isDrawerShow"
      >
        <!-- 外部 -->
        <div
          class="message-content"
          v-for="item in messageList"
          :key="item.id"
          @click="showSelfMessage(item.author)"
        >
          <!-- 头像 -->
          <div class="author-img">
            <img :src="item.authorImg" />
          </div>
          <div class="content">
            <div class="top-content">
              <span class="name">{{ item.author }}</span>
              <!-- 日期 -->
              <span class="date-time">{{ item.pubTime }}</span>
            </div>
            <div class="bottom-content">
              <span class="commend">{{ item.content }}</span>
            </div>
          </div>
        </div>
        <!-- 外部 -->
        <el-drawer
          :withHeader="false"
          :append-to-body="true"
          :visible.sync="innerDrawer"
          size="28%"
          @close="close"
        >
          <!-- 内部 -->
          <div class="inDrawer">
            <div class="title">
              music聊天室(
              <span class="title-color">{{ currentAuthor }}</span>
              )
            </div>
            <div class="scrollBox">
              <HeadVueScroll :ops="scrollOps" ref="myVs">
                <div class="content" v-html="content"></div>
              </HeadVueScroll>
            </div>
            <div class="writeContent">
              <div class="box-text">
                <textarea
                  class="write"
                  v-model="text"
                  maxlength="120"
                  placeholder="120字限制"
                ></textarea>
              </div>
              <div class="sendModel">
                <el-button type="primary" size="mini" @click="send"
                  >发送</el-button
                >
              </div>
            </div>
          </div>
          <!-- 外部 -->
        </el-drawer>
      </el-drawer>
      <!-- 消息 -->
      <el-drawer
        :withHeader="false"
        :append-to-body="true"
        :visible.sync="chatDrawer"
        size="28%"
        @close="close"
      >
        <!-- 内部 -->
        <div class="inDrawer">
          <div class="title">
            music聊天室(
            <span class="title-color">{{ currentAuthor }}</span>
            )
          </div>
          <div class="scrollBox">
            <HeadVueScroll :ops="scrollOps" ref="myVs">
              <div class="content" v-html="content"></div>
            </HeadVueScroll>
          </div>
          <div class="writeContent">
            <div class="box-text">
              <textarea
                class="write"
                v-model="text"
                maxlength="120"
                placeholder="120字限制"
              ></textarea>
            </div>
            <div class="sendModel">
              <el-button type="primary" size="mini" @click="send"
                >发送</el-button
              >
            </div>
          </div>
        </div>
        <!-- 外部 -->
      </el-drawer>
    </div>
  </div>
</template>

<script>
import "@/assets/css/header/header.less";
import request from "@/utils/request.js";
import bus from "@/plugins/eventBus.js";
import showDra from "@/plugins/eventBus.js";
import flushDetail from "@/plugins/eventBus.js";
import { friendlyFormatTime } from "@/utils/formatDateUtil.js";
import { mapGetters } from "vuex";
import HeadVueScroll from "vuescroll/dist/vuescroll-native";
let socket;
export default {
  components: {
    HeadVueScroll,
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
  props: ["mychoice"],
  data() {
    return {
      keyword: "",
      authorImg: this.$store.getters.getHost + "img/user/user-default.png",
      username: "",
      flagLogin: true,
      drawer: false,
      innerDrawer: false,
      currentAuthor: "",
      text: "",
      content: "",
      numberPriMsg: 0,
      numberReplyMessage: 0,
      messageList: [],
      isDrawerShow: true,
      chatDrawer: false,
      //滚动条配置
      scrollOps: {
        mode: "native",
        locking: "true",
        bar: {
          background: "rgb(150,161,195)",
        },
      },
    };
  },
  methods: {
    async reload() {
      this.isDrawerShow = false;
      await this.$nextTick();
      this.isDrawerShow = true;
    },
    //发送消息
    send() {
      if (this.text.trim() == "") {
        this.$message({ type: "warning", message: "请输入内容" });
      } else {
        if (typeof WebSocket == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          // 组装待发送的消息 json
          // {"from": "zhang", "to": "admin", "text": "聊天文本"}
          let message = {
            from: this.username,
            to: this.currentAuthor,
            text: this.text,
          };
          // 将组装好的json发送给服务端，由服务端进行转发
          socket.send(JSON.stringify(message));
          //把发送的文本清空
          this.text = "";
        }
      }
    },
    createContent(nowUser, remoteUser, text) {
      // 这个方法是用来将 json的聊天消息数据转换成 html的。
      let html;
      // 当前用户消息
      if (nowUser) {
        // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
        html =
          '<div class="tip-body right">\n' +
          '<div class="tip right-color">' +
          text +
          "</div>\n" +
          "</div>";
      } else if (remoteUser) {
        // remoteUser表示远程用户聊天消息，蓝色的气泡
        html =
          '<div class="tip-body left">\n' +
          '<div class="tip left-color">' +
          text +
          "</div>\n" +
          "</div>";
      }
      this.content += html;
      //让滚动条自动滚到最下面
      this.$nextTick(() => {
        if (this.$refs["myVs"].scrollTo != null) {
          this.$refs["myVs"].scrollTo(
            {
              y: "100%",
            },
            500,
            "easeInQuad"
          );
        }
      });
    },
    close() {
      this.showMessage();
    },
    async closed() {
      this.reload();
    },
    init() {
      //用来初始化消息
      let username = this.username;
      let toUsername = this.currentAuthor;
      this.content = "";
      let _this = this;
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl =
          "ws://localhost:443/musicserver/" + username + "/" + toUsername;
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        //  浏览器端收消息,获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
          // 对收到的json数据进行解析
          let data = JSON.parse(msg.data);
          for (let i = 0; i < data.length; i++) {
            //构建内容
            if (data[i].from == _this.username) {
              _this.createContent(data[i].from, null, data[i].text);
            } else if (data[i].to == _this.username) {
              _this.createContent(null, data[i].to, data[i].text);
            }
          }
        };
        //关闭事件
        socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        };
      }
    },
    //显示外部消息队列
    async showMessage() {
      //列出给我的私信队列
      const { data: res } = await request.get("/social/getPriMsgArray");
      //格式化时间
      res.data.forEach((item, index) => {
        item.pubTime = friendlyFormatTime(item.pubTime);
      });
      this.messageList = res.data;
    },
    //内部消息队列
    async showSelfMessage(author) {
      this.innerDrawer = true;
      this.currentAuthor = author;
      //先把消息表示为已读
      await request.delete("/social/consumeMsg/" + author);
      this.init();
    },
    //搜索
    onSearch() {
      if (this.keyword.trim() == "") {
        this.$message({
          type: "warning",
          message: "请输入内容",
          duration: 800,
        });
      } else {
        //搜索出来的结果
        if (this.$route.path == "/search") {
          bus.$emit("searchResult", this.keyword);
        } else {
          this.$router.push({ path: "/search", query: { word: this.keyword } });
        }
      }
    },
    //菜单触发
    async handleToggle(val) {
      if (val == true && this.username != "") {
        //更新自己未读的私信数量
        const { data: res } = await request.get("/social/getPriMsgNum");
        this.numberPriMsg = res.data;
        //更新未读回复信息的数量
        const { data: res2 } = await request.get("/social/getReplyMsgNum");
        this.numberReplyMessage = res2.data;
      } else {
        this.numberPriMsg = 0;
        this.numberReplyMessage = 0;
      }
    },
    //菜单跳转
    async handleCommand(command) {
      if (this.username == "") {
        this.$store.commit("setErrorMsg", "请登陆后操作");
        this.$router.push("/login");
      } else {
        if (command == "我的主页") {
          this.$message("欢迎来到" + command);
          if (this.$route.path == "/home1" && this.numberReplyMessage != 0) {
            flushDetail.$emit("flushDetail");
          } else {
            this.$router.push({ path: "/home1" });
          }
        } else if (command == "分享云村") {
          this.$message("欢迎来到" + "云村");
          this.$router.push({ path: "/dynamicSquare" });
        } else if (command == "我的私信") {
          this.showMessage();
          this.drawer = true;
        } else if (command == "退出登录") {
          this.$store.commit("deleteToken");
          this.$store.commit("setIsLike", false);
          location.reload();
        }
      }
    },
    //去登录页面
    goLogin() {
      this.$store.commit("setErrorMsg", "");
      this.$router.push({ path: "/login" });
    },
    async getUserAndConnect() {
      const { data: res } = await request.get("/user/info");
      if (res.code == 200) {
        this.username = res.data.username;
        this.authorImg = this.$store.getters.getHost + res.data.avatar;
        this.flagLogin = true;
        let socketUrl =
          "ws://localhost:443/musicserver/" +
          this.username +
          "/" +
          "nullusername";
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
      } else {
        this.flagLogin = false;
      }
    },
    changeTopStyle() {
      this.$refs.index.$el.style.color = "";
      this.$refs.songList.$el.style.color = "";
      this.$refs.singerList.$el.style.color = "";
      this.$refs.myMusic.$el.style.color = "";
      if (this.mychoice === "index") {
        this.$refs.index.$el.style.color = "royalblue";
      } else if (this.mychoice === "songList") {
        this.$refs.songList.$el.style.color = "royalblue";
      } else if (this.mychoice === "singer") {
        this.$refs.singerList.$el.style.color = "royalblue";
      } else if (this.mychoice === "favor") {
        this.$refs.myMusic.$el.style.color = "royalblue";
      }
    },
  },
  created() {
    //获取用户信息
    this.getUserAndConnect();
    this.mychoice = localStorage.getItem("selectView");
  },
  mounted() {
    this.changeTopStyle();
    showDra.$on("showPriChat", async (author) => {
      this.chatDrawer = true;
      this.currentAuthor = author;
      //先把消息表示为已读
      await request.delete("/social/consumeMsg/" + author);
      this.init();
    });
  },
  watch: {
    getToken() {
      this.getUserAndConnect();
    },
    mychoice() {
      this.changeTopStyle();
    },
  },
};
</script>

<style></style>
