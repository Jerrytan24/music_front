<template>
  <div>
    <div class="home-content">
      <div class="top-personal">
        <div class="left-person">
          <img v-lazy="avatar" />
        </div>
        <div class="right-person">
          <div class="information-top">
            <span>{{ username }}</span>
            <el-button
              type="primary"
              class="edit-message"
              v-if="permission == '1'"
              @click="toEdit()"
              >编辑个人信息</el-button
            >
            <el-button
              type="primary"
              class="edit-message"
              round
              @click="clickFocusOn('未关注')"
              v-else-if="permission == '0' && clickFocus == '未关注'"
              >关注</el-button
            >
            <el-button
              type="success"
              class="edit-message"
              round
              @click="clickFocusOn('已关注')"
              v-else-if="permission == '0' && clickFocus == '已关注'"
              >已关注</el-button
            >
          </div>
          <div class="information-bottom">
            <div class="middle-message">
              <div class="dynamic ms-common">
                <div class="num">{{ dynamicNum }}</div>
                <div class="name">动态</div>
              </div>
              <div class="focus-on ms-common">
                <div class="num">{{ focusNum }}</div>
                <div class="name">关注</div>
              </div>
              <div class="fan ms-common">
                <div class="num">{{ fanNum }}</div>
                <div class="name">粉丝</div>
              </div>
            </div>
            <div class="bottom-message">
              <span>地区:&nbsp;&nbsp;{{ area }}</span>
              <span class="sex">性别:&nbsp;&nbsp;{{ gender }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="body-personal" v-if="permission == '1'">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="消息回复中心" name="message">
            <!-- 收到的回复的消息 -->
            <div
              class="share-content"
              v-for="(item, index) in replayList"
              :key="index"
            >
              <!-- 头像 -->
              <div class="author-img">
                <img :src="item.authorImg" @click="toUserHome(item.author)" />
              </div>
              <!-- 评论内容-->
              <div class="content">
                <div class="top-content">
                  <span class="name">{{ item.author }}:&nbsp;</span>
                  <span class="commend">{{ item.content }}</span>
                </div>
                <div class="middle-commend">
                  <span class="darr">
                    <i class="bg">◆</i>
                  </span>
                  <a class="link-name" href="javascript:void(0)">我的评论:</a>
                  {{ item.myComment }}
                </div>
                <div class="bottom-content">
                  <!-- 日期 -->
                  <div class="date-time">{{ item.pubTime }}</div>
                  <div class="like-chat">
                    <span @click="reply()"></span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 回复的评论结束 -->
            <p v-if="more == true" class="can-more">
              <el-divider
                ><a style="cursor: pointer" @click="getMore"
                  >加载更多</a
                ></el-divider
              >
            </p>
            <p v-else-if="more == false" class="message-no-more">没有更多了</p>
          </el-tab-pane>
          <el-tab-pane label="我发表的动态" name="dynamic"
            >我发表的动态</el-tab-pane
          >
          <el-tab-pane label="我的关注" name="myFocusOn">
            <!-- 关注的人-->
            <div
              class="focus-people"
              v-for="(item, index) in focusList"
              :key="index"
            >
              <el-badge is-dot class="dot">
                <img
                  class="user-img"
                  :src="item.userImg"
                  @click="priChat(item.username)"
                />
              </el-badge>
              <div class="info">
                <p class="pre-name">
                  <a
                    class="text-boy"
                    v-if="item.sex == '男'"
                    href="javascript:void(0)"
                    >{{ item.username }}</a
                  >
                  <a class="text-girl" v-else href="javascript:void(0)">
                    {{ item.username }}
                  </a>
                  <i class="m-icon boy" v-if="item.sex == '男'"></i>
                  <i class="m-icon girl" v-else></i>
                </p>
                <p class="body-info">
                  <span>动态: {{ item.dynamicNum }}</span
                  >| <span>关注: {{ item.focusOnNum }}</span
                  >|
                  <span>粉丝: {{ item.fanNum }}</span>
                </p>
              </div>
              <el-button
                class="private"
                type="primary"
                @click="sendPriMessage(item.userId)"
                ><i></i>&nbsp;<span>发送私信</span></el-button
              >
            </div>
            <!-- 关注的人 -->
          </el-tab-pane>
          <el-tab-pane label="我的粉丝" name="myFan">
            <!-- 我的粉丝-->
            <div
              class="fan-people"
              v-for="(item, index) in fanList"
              :key="index"
            >
              <el-badge is-dot class="dot">
                <img
                  class="user-img"
                  :src="item.userImg"
                  @click="priChat(item.username)"
                />
              </el-badge>
              <div class="info">
                <p class="pre-name">
                  <a
                    class="text-boy"
                    v-if="item.sex == '男'"
                    href="javascript:void(0)"
                    >{{ item.username }}</a
                  >
                  <a class="text-girl" v-else href="javascript:void(0)">
                    {{ item.username }}
                  </a>
                  <i class="m-icon boy" v-if="item.sex == '男'"></i>
                  <i class="m-icon girl" v-else></i>
                </p>
                <p class="body-info">
                  <span>动态: {{ item.dynamicNum }}</span
                  >| <span>关注: {{ item.focusOnNum }}</span
                  >|
                  <span>粉丝: {{ item.fanNum }}</span>
                </p>
              </div>
              <el-button
                class="private"
                type="primary"
                @click="sendPriMessage(item.userId)"
                ><i></i>&nbsp;<span>发送私信</span></el-button
              >
            </div>
            <!-- 我的粉丝 -->
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else-if="permission == '0'" class="no-permission">
        暂无权限查看
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/css/homepage/homepage.less";
import request from "@/utils/request.js";
import showDra from "@/plugins/eventBus.js";
import flushDetail from "@/plugins/eventBus.js";
import { friendlyFormatTime } from "@/utils/formatDateUtil.js";
const qs = require("qs");
export default {
  data() {
    return {
      username: "",
      tempName: "",
      avatar: "",
      gender: "",
      area: "",
      dynamicNum: 0,
      focusNum: 0,
      fanNum: 0,
      totalReply: 0,
      activeName: "message",
      permission: "", //1代表是本人在看自己的主页，0是访问别人的主页
      clickFocus: "",
      more: "",
      messagePage: 1,
      focusList: [],
      fanList: [],
      replayList: [],
    };
  },
  methods: {
    priChat(username) {
      //传递信息给头部，通知其打开对话框
      showDra.$emit("showPriChat", username);
    },
    async sendPriMessage(userId) {
      this.$prompt("", "发送私信", {
        distinguishCancelAndClose: true,
        inputPlaceholder: "限制为120字",
        confirmButtonText: "发送",
        inputValidator: (value) => {
          if (value == "" || value == null) {
            return "内容不能为空";
          }
          // 点击按钮时，对文本框里面的值进行验证
          if (value.trim().length > 120) {
            //发表评论(超过120字限制)
            return "超过120字限制";
          }
        },
      }).then(async ({ value }) => {
        //把发送给别人的信息先存起来
        const { data: res } = await request.post("/social/sendMessageToUser", {
          recUserId: userId,
          message: value,
        });
        this.$message({
          type: "success",
          message: "发送成功",
          duration: 800,
        });
      });
    },
    handleClick(tab, event) {
      if (this.activeName == "myFocusOn") {
        this.getFocusList();
      } else if (this.activeName == "myFan") {
        this.getFanList();
      } else if (this.activeName == "message") {
        this.messagePage = 1;
        this.getMessage(1);
      }
    },
    async getTotalReply() {
      //获取总回复数
      const { data: res } = await request.get("/social/getAllReplyMessageNum");
      this.totalReply = res.data;
    },
    reply() {},
    async getMessage(page) {
      //得到总数量
      await this.getTotalReply();
      //获取用户回复自己的消息
      const { data: res } = await request.get(
        "/social/getReplyMessage/" + page
      );
      //把回复自己的消息状态置为已读状态(全部)
      await request.put("/social/updateReplyMessage");
      //格式化时间
      res.data.forEach((item) => {
        item.pubTime = friendlyFormatTime(item.pubTime);
        item.authorImg = this.$store.getters.getHost + item.authorImg;
      });
      this.replayList = res.data;
      if (this.replayList.length == this.totalReply) {
        this.more = false;
      } else {
        this.more = true;
      }
    },
    async getMore() {
      this.messagePage = this.messagePage + 1;
      this.getMessage(this.messagePage);
    },
    async getFanList() {
      //获取我粉丝的信息
      const { data: res } = await request.get("/social/getFanUser");
      if (res.code == 200) {
        this.fanList = res.data;
      }
    },
    async getFocusList() {
      //获取我关注的人的信息
      const { data: res } = await request.get("/social/getFocusUser");
      if (res.code == 200) {
        this.focusList = res.data;
      }
    },
    toEdit() {
      this.$router.push({ path: "/edit" });
    },
    async toUserHome(author) {
      if (this.username != author) {
        this.tempName = author;
        this.$router.push({ path: "/home" });
      } else {
        await this.init();
      }
    },
    async clickFocusOn(value) {
      if (value == "未关注") {
        //关注用户
        const { data: res } = await request.post(
          "/social/addFocusUser",
          qs.stringify({ name: this.username })
        );
        if (res.code == 200) {
          this.clickFocus = "已关注";
          this.$message({
            type: "success",
            message: "关注成功",
            duration: 800,
          });
          this.fanNum++;
        } else {
          this.$message({
            type: "warning",
            message: "请登陆后再关注",
            duration: 800,
          });
        }
      } else {
        const { data: res } = await request.post(
          "/social/deleteFocusUser",
          qs.stringify({ name: this.username })
        );
        this.clickFocus = "未关注";
        //取消关注用户
        this.$message({
          type: "success",
          message: "取消关注成功",
          duration: 800,
        });
        this.fanNum--;
      }
    },
    async init() {
      let name;
      if (this.tempName != "") {
        name = this.tempName;
      } else {
        name = this.$route.query.user;
      }
      const { data: res } = await request.get("/user/info");
      if (name == null || name == res.data.username) {
        //访问自己的主页
        this.permission = "1";
        if (res.code == 200) {
          //保存数据
          this.username = res.data.username;
          this.avatar = this.$store.getters.getHost + res.data.avatar;
          this.gender = res.data.gender;
          this.area = res.data.area;
          this.messagePage = 1;
          this.getMessage(1);
        } else {
          this.$store.commit("setErrorMsg", "请登录后操作");
          this.$router.push({ path: "/login" });
        }
      } else {
        //别人的主页
        const { data: res1 } = await request.get("/user/otherInfo", {
          params: {
            username: name,
          },
        });
        this.permission = "0";
        if (res1.code == 200) {
          this.username = res1.data.username;
          this.avatar = this.$store.getters.getHost + res1.data.avatar;
          this.gender = res1.data.gender;
          this.area = res1.data.area;
        }
        //再发一次请求，看有没有关注过这个人
        const { data: res3 } = await request.get("/social/getHomeFocus", {
          params: {
            name: name,
          },
        });
        if (res3.code == 200) {
          if (res3.data == "已关注") {
            this.clickFocus = "已关注";
          } else {
            this.clickFocus = "未关注";
          }
        } else {
          this.clickFocus = "未关注";
        }
      }
      //获取发表动态数，关注数和粉丝数
      const { data: res2 } = await request.get("/social/getHomeNum", {
        params: {
          username: this.username,
        },
      });
      this.dynamicNum = res2.data.dynamicNum;
      this.focusNum = res2.data.focusNum;
      this.fanNum = res2.data.fanNum;
    },
  },
  watch: {
    $route: {
      handler: async function (route) {
        if (route.path == "/home1") {
          this.tempName = "";
        }
        await this.init();
      },
    },
  },
  async created() {
    await this.init();
    flushDetail.$on("flushDetail", () => {
      this.getMessage(1);
    });
  },
};
</script>

<style>
</style>