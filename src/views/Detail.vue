<template>
  <div class="bg-contain">
    <div class="contain-lyric">
      <!-- 歌词内容 -->
      <Lyric></Lyric>
      <!-- 评论 -->
      <div class="share">
        <!-- 标题 -->
        <div class="share-title">
          <h2>
            全部评论 <span> ({{ totalCommend }}) </span>
            <!-- 评论排序的开关 -->
            <el-switch
              v-model="switchSort"
              active-text="最新评论"
              active-color="#2f2f2f"
              inactive-text="最热门评论"
              class="switchRight"
              @change="changeActive"
            >
            </el-switch>
          </h2>
        </div>
        <!-- 评论主体 -->
        <div
          class="share-content"
          v-for="(item, index) in commendList"
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
            <div class="bottom-content">
              <!-- 日期 -->
              <div class="date-time">{{ item.pubTime }}</div>
              <div class="like-chat">
                <span>
                  <transition name="slide-fade" mode="out-in">
                    <span
                      class="love"
                      v-if="item.love == true"
                      key="love"
                      @click="clickLove(item.id, 'true')"
                      ></span
                    >
                    <span
                      class="unlove"
                      v-else
                      key="unLove"
                      @click="clickLove(item.id, 'false')"
                      ></span
                    >
                  </transition>
                  {{ item.like }}
                </span>
                <span></span>
                <span @click="reply(item.id)"></span>
              </div>
            </div>
          </div>
        </div>
        <p v-if="commendList.length == 0" class="center">暂无评论</p>
        <p v-else-if="loading" class="center">加载中...</p>
        <p v-else-if="noMore" class="center">没有更多了</p>
      </div>
      <el-button type="info" round @click="open" class="commentButton"
        >写评论</el-button
      >
    </div>
  </div>
</template>

<script>
import "@/assets/css/detail/detail.less";
import request from "@/utils/request.js";
import { friendlyFormatTime } from "@/utils/formatDateUtil.js";
import Lyric from "@/components/audio/Lyric.vue";
const qs = require("qs");
import { mapGetters } from "vuex";
export default {
  //初始化评论
  async created() {
    //获取用户信息
    const { data: res } = await request.get("/user/info");
    if (res.code == 200) {
      this.username = res.data.username;
    }
    //获取最新的评论
    this.getNewCommentList(1);
  },
  //添加监听滚动事件
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  data() {
    return {
      totalCommend: 0, //总评论
      loading: false,
      noMore: false,
      switchSort: true,
      currentPage: 1,
      type: "最新评论",
      username: "",
      commendList: [],
    };
  },
  components: {
    Lyric,
  },
  computed: {
    ...mapGetters([
      "id", //歌曲id
    ]),
  },
  methods: {
    toUserHome(author) {
      this.$router.push({ path: "/home", query: { user: author } });
    },
    async reply(commentId) {
      const { data: res } = await request.get("/user/info");
      if (res.code == 200) {
        this.$prompt("", "回复评论", {
          distinguishCancelAndClose: true,
          inputPlaceholder: "限制为120字",
          confirmButtonText: "发送",
          inputValidator: (value) => {
            // 点击按钮时，对文本框里面的值进行验证
            if (value.trim().length > 120) {
              //回复评论(超过120字限制)
              return "超过120字限制";
            }
          },
        }).then(async ({ value }) => {
          if (this.id == "") {
            this.$message({
              type: "warning",
              message: "歌曲信息为空,无法发送",
              duration: 800,
            });
          } else {
            //把回复存到数据库中去
            if (res.code == 200) {
              //回复评论
              //把回复存到数据库中去
              const { data: res } = await request.post(
                "/comment/replyComment",
                {
                  commentId: commentId,
                  text: value,
                }
              );
              this.$message({
                type: "success",
                message: "发送成功",
                duration: 800,
              });
            }
          }
        });
      } else {
        this.$store.commit("setErrorMsg", "请登陆后发表评论");
        this.$router.push("/login");
      }
    },
    async open() {
      const { data: res } = await request.get("/user/info");
      if (res.code == 200) {
        this.$prompt("", "发表评论", {
          distinguishCancelAndClose: true,
          inputPlaceholder: "限制为120字",
          confirmButtonText: "发送",
          inputValidator: (value) => {
            // 点击按钮时，对文本框里面的值进行验证
            if (value.trim().length > 120) {
              //发表评论(超过120字限制)
              return "超过120字限制";
            }
          },
        }).then(async ({ value }) => {
          if (this.id == "") {
            this.$message({
              type: "warning",
              message: "歌曲信息为空,无法发送",
              duration: 800,
            });
          } else {
            //把评论存到数据库中去
            const { data: res } = await request.post("/comment/pubComment", {
              songId: this.id,
              text: value,
            });
            if (res.code == 200) {
              //发表评论
              this.$message({
                type: "success",
                message: "发送成功",
                duration: 800,
              });
              this.commendList = [];
              this.currentPage = 1;
              if (this.type == "最新评论") {
                this.getNewCommentList(1);
              } else {
                this.getHotCommentList(1);
              }
            }
          }
        });
      } else {
        this.$store.commit("setErrorMsg", "请登陆后操作");
        this.$router.push("/login");
      }
    },
    //找到一共有的评论数
    async getAllCommentCount() {
      if (this.id != "") {
        const { data: res } = await request.get("/comment/getAllCommentCount", {
          params: { songId: this.id },
        });
        this.totalCommend = res.data;
      }
    },
    //根据歌曲的id获取最新的评论(初始数量)
    async getNewCommentList(page) {
      this.noMore = false;
      await this.getAllCommentCount();
      if (page > Math.ceil(this.totalCommend / 5)) {
        this.currentPage = this.currentPage - 1;
        return;
      }
      if (this.id != "") {
        const { data: res } = await request.get(
          "/comment/getNewCommentList/" + page,
          {
            params: { songId: this.id, username: this.username },
          }
        );
        //格式化时间
        res.data.forEach((item) => {
          item.pubTime = friendlyFormatTime(item.pubTime);
          item.authorImg = this.$store.getters.getHost + item.authorImg;
        });
        this.commendList = res.data;
      }
    },
    //加载评论数(滚动事件的监听处理)
    handleScroll() {
      if (
        document.documentElement.scrollTop + window.innerHeight - 46 >=
        document.body.offsetHeight
      ) {
        if (this.commendList.length >= this.totalCommend) {
          this.noMore = true;
          return;
        } else {
          this.loading = true;
          this.currentPage = this.currentPage + 1;
          if (this.type == "最新评论") {
            this.getNewCommentList(this.currentPage);
          } else if (this.type == "最热门评论") {
            this.getHotCommentList(this.currentPage);
          }
          this.loading = false;
        }
      }
    },
    //获取点赞数最多的评论
    async getHotCommentList(page) {
      this.noMore = false;
      await this.getAllCommentCount();
      if (page > Math.ceil(this.totalCommend / 5)) {
        this.currentPage = this.currentPage - 1;
        return;
      }
      if (this.id != "") {
        const { data: res } = await request.get(
          "/comment/getHotCommentList/" + page,
          {
            params: { songId: this.id, username: this.username },
          }
        );
        //格式化时间
        res.data.forEach((item) => {
          item.pubTime = friendlyFormatTime(item.pubTime);
          item.authorImg = this.$store.getters.getHost + item.authorImg;
        });
        this.commendList = res.data;
      }
    },
    //改变排序行为
    changeActive(active) {
      if (active == true) {
        this.commendList = [];
        this.currentPage = 1;
        this.type = "最新评论";
        //获取最新评论
        this.getNewCommentList(1);
      } else if (active == false) {
        this.commendList = [];
        this.currentPage = 1;
        this.type = "最热门评论";
        //获取点赞数最多的评论
        this.getHotCommentList(1);
      }
    },
    //点赞或取消点赞
    async clickLove(id, love) {
      if (love == "false") {
        //点赞评论
        const { data: res } = await request.post(
          "/comment/addCommentLike/" + id
        );
        if (res.code == 200) {
          //修改commendList某条评论的点赞状态
          this.commendList.forEach((item) => {
            if (item.id == id) {
              item.love = true;
              item.like++;
            }
          });
          this.$message({
            type: "success",
            message: "点赞成功",
            duration: 800,
          });
        } else {
          this.$message({
            type: "error",
            message: "请登陆后点赞",
            duration: 800,
          });
        }
      } else if (love == "true") {
        //取消点赞
        const { data: res2 } = await request.delete(
          "/comment/deleteCommentLike/" + id
        );
        if (res2.code == 200) {
          //修改commendList某条评论的点赞状态
          this.commendList.forEach((item) => {
            if (item.id == id) {
              item.love = false;
              item.like--;
            }
          });
          this.$message({
            type: "success",
            message: "取消点赞成功",
            duration: 800,
          });
        }
      }
    },
  },
};
</script>

<style lang="less">
</style>