<template>
  <div>
    <div class="fixed-bg"></div>
    <div class="dynamic-content">
      <div class="section-block">
        <!-- 输入文字框 -->
        <div class="text-input">
          <el-input
            type="textarea"
            placeholder="请输入评论内容"
            v-model="textarea"
            maxlength="120"
            show-word-limit
            rows="5"
            resize="none"
            class="writeDynamic"
          >
          </el-input>
          <i class="iconfont emo" @click="showEmo">&#xe69a;</i>
          <VEmojiPicker
            v-show="showEmoji"
            @select="selectEmoji"
            class="showMyEmo"
          />
        </div>
        <!-- 输入文字框 -->
        <!-- 选择音乐发布 -->
        <div class="select-music">
          <div class="selectSongName">
            <i class="iconfont music-ico">&#xe628;</i>
            <div class="select-song">
              <el-col :span="12">
                <el-autocomplete
                  class="inline-input"
                  v-model="songName"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容(歌曲-歌手)"
                  :trigger-on-focus="false"
                  :maxlength="16"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-col>
            </div>
            <i class="iconfont add-ico">&#xe622;</i>
          </div>
        </div>
        <!-- 选择音乐发布 -->
        <!-- 选择图片发布 -->
        <!-- 最大上传9个文件，不自动提交，可以多选，可以移除，可以预览大图,只能上传图片，不能超过10MB-->
        <div class="select-img">
          <el-upload
            ref="dynamicUpload"
            action="http://localhost:443/file/upLoadFile/dynamic"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit="9"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            multiple
            :auto-upload="false"
            :before-upload="beforeUpload"
            accept="image/*"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
        <!-- 选择图片发布 -->
        <el-button type="primary submitDynamic" @click="submitDynamic"
          >发布动态</el-button
        >
      </div>
      <div class="tipMessage" v-if="hasNewTip" @click="currentChange(1)">
        有新动态发布<i class="iconfont new-down">&#xe6b9;</i>
      </div>
      <div class="main-dynamic-content">
        <transition-group name="list-complete">
          <div
            class="dynamic-card"
            v-for="(itemDynamic, dynamicIndex) in dynamicMsgList"
            :key="dynamicIndex"
          >
            <div class="mface">
              <img
                class="face-img"
                v-lazy="itemDynamic.faceImgUrl"
                @click="toUserHome(itemDynamic.author)"
              />
            </div>
            <div class="gcnt">
              <div class="pubAuthor">
                {{ itemDynamic.author }}<span>分享</span>
              </div>
              <div class="pubDate">{{ itemDynamic.pubTime }}</div>
              <div class="pubContent">
                {{ itemDynamic.content }}
              </div>
              <div class="pubSong" v-if="itemDynamic.songId != 0">
                <div class="song-img" @click="onPlay(itemDynamic.songId)">
                  <div class="cover">
                    <span class="icon_play">
                      <i class="iconfont myfont">&#xe62b;</i>
                    </span>
                  </div>
                  <img v-lazy="itemDynamic.songImgUrl" />
                </div>
                <div class="pubSongMsg">
                  <div class="songName">{{ itemDynamic.pubSongName }}</div>
                  <div class="singer">{{ itemDynamic.pubSinger }}</div>
                </div>
              </div>
              <div class="pubImg">
                <el-image
                  style="width: 120px; height: 120px"
                  v-for="(item1, index1) in itemDynamic.pubImgList"
                  :key="index1"
                  :src="item1.imgSrc"
                  :preview-src-list="item1.srcList"
                >
                </el-image>
              </div>
            </div>
            <div class="dynamic_text">
              <i
                class="iconfont weibo"
                v-show="itemDynamic.author == name"
                @click="
                  forwardWeibo(
                    itemDynamic.content,
                    itemDynamic.pubImgList,
                    itemDynamic.songId,
                    itemDynamic.pubSongName,
                    itemDynamic.pubSinger
                  )
                "
                >&#xe62e;</i
              >
              <i
                class="iconfont"
                @click="showSelfComm(itemDynamic.id, dynamicIndex)"
                >&#xe663;</i
              >
            </div>
            <!-- 评论区 -->
            <div
              class="comment-area"
              v-show="show_main_comments[itemDynamic.id]"
            >
              <div class="comminication">
                <textarea
                  placeholder="发布你的评论"
                  maxlength="140"
                  :ref="'mainText' + itemDynamic.id"
                ></textarea>
              </div>
              <el-button
                type="primary"
                class="pub-comment"
                round
                @click="sendMainComm(itemDynamic.id, dynamicIndex)"
                >发表评论</el-button
              >
              <div class="main-comment">
                <div
                  v-if="
                    itemDynamic.dynamicCommentList == null ||
                    itemDynamic.dynamicCommentList.length == 0
                  "
                  class="no-dynamicComm"
                >
                  暂无评论
                </div>
                <div
                  class="share-content"
                  v-for="(
                    itemOutCom, indexOut
                  ) in itemDynamic.dynamicCommentList"
                  :key="indexOut"
                >
                  <div class="main-message">
                    <!-- 头像 -->
                    <div class="author-img">
                      <img
                        :src="itemOutCom.authorImg"
                        @click="toUserHome(itemOutCom.author)"
                      />
                    </div>
                    <!-- 评论内容-->
                    <div class="content">
                      <div class="top-content">
                        <span class="name">{{ itemOutCom.author }}:&nbsp;</span>
                        <span class="commend">{{ itemOutCom.content }}</span>
                      </div>
                      <div class="bottom-content">
                        <!-- 日期 -->
                        <div class="date-time">{{ itemOutCom.pubTime }}</div>
                        <div class="like-chat">
                          <!-- 外层 -->
                          <i
                            class="iconfont"
                            @click="replyOut(itemOutCom.author, itemOutCom.id)"
                            >&#xe663;</i
                          >
                          <!-- 外层 -->
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="vice-message">
                    <div
                      class="vice-share"
                      v-for="(itemInCom, indexIn) in itemOutCom.viceCommentList"
                      :key="indexIn"
                    >
                      <!-- 头像 -->
                      <div class="author-img">
                        <img
                          :src="itemInCom.authorImg"
                          @click="toUserHome(itemInCom.author)"
                        />
                      </div>
                      <!-- 评论内容-->
                      <div class="content">
                        <div class="top-content">
                          <span class="name" v-if="itemInCom.type == 1"
                            >{{ itemInCom.author }}:&nbsp;</span
                          >
                          <span class="has-vice" v-if="itemInCom.type == 2">
                            <span class="name">{{ itemInCom.author }}</span>
                            回复
                            <span
                              class="vice-name"
                              v-if="itemInCom.author == itemInCom.viceAuthor"
                              >@{{ itemInCom.viceAuthor }}：</span
                            >
                            <span
                              class="other-vice-name"
                              v-else
                              @click="toUserHome(itemInCom.viceAuthor)"
                              >@{{ itemInCom.viceAuthor }}：</span
                            >
                          </span>
                          <span class="commend">{{ itemInCom.content }}</span>
                        </div>
                        <div class="bottom-content">
                          <!-- 日期 -->
                          <div class="date-time">{{ itemInCom.pubTime }}</div>
                          <div class="like-chat">
                            <i
                              class="iconfont"
                              @click="replyIn(itemInCom.author, itemOutCom.id)"
                              >&#xe663;</i
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="vice-page" v-if="itemOutCom.totalViceComm >= 6">
                      <el-pagination
                        layout="prev, pager, next"
                        :total="itemOutCom.totalViceComm"
                        :page-size="5"
                        small
                        :current-page="vice_page[itemOutCom.id]"
                        @current-change="
                          currentInChangeList(
                            $event,
                            itemOutCom.id,
                            dynamicIndex,
                            indexOut
                          )
                        "
                      >
                      </el-pagination>
                    </div>
                    <div v-show="show_vice_comments[itemOutCom.id]">
                      <div class="comminication vice-comm">
                        <textarea
                          placeholder=""
                          :ref="'viceText' + itemOutCom.id"
                          maxlength="140"
                        ></textarea>
                      </div>
                      <el-button
                        type="primary"
                        class="pub-comment vice-pubComm"
                        round
                        @click="
                          pubViceComm(itemOutCom.id, dynamicIndex, indexOut)
                        "
                        >发表评论</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="main-page" v-if="itemDynamic.totalMainComm >= 6">
                <el-pagination
                  layout="prev, pager, next"
                  :total="itemDynamic.totalMainComm"
                  :page-size="5"
                  :current-page="main_page[itemDynamic.id]"
                  small
                  @current-change="
                    currentOutChangeList($event, itemDynamic.id, dynamicIndex)
                  "
                >
                </el-pagination>
              </div>
            </div>
            <!-- 评论区 -->
          </div>
        </transition-group>
      </div>
      <div class="page">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalDynamicNum"
          :page-size="6"
          @current-change="currentChange"
          :current-page="currentPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import { friendlyFormatTime } from "@/utils/formatDateUtil.js";
import { toWeibo } from "@/utils/share.js";
const qs = require("qs");
let socket;
export default {
  data() {
    return {
      hasNewTip: false,
      textarea: "",
      showEmoji: false,
      dialogImageUrl: "",
      dialogVisible: false,
      songName: "",
      timeout: null,
      songId: 0,
      imgUrlList: [],
      totalDynamicNum: 0,
      currentPage: 1,
      show_main_comments: [],
      show_vice_comments: [],
      main_page: [],
      vice_page: [],
      dynamicMsgList: [],
      name: "",
    };
  },
  async created() {
    //获取用户信息
    const { data: res } = await request.get("/user/info");
    if (res.code == 200) {
      this.currentChange(1);
      //连接动态消息通知的socket
      this.initDynamicSocket(res.data.username);
      this.name = res.data.username;
    } else {
      this.$store.commit("setErrorMsg", "请登陆后操作");
      this.$router.push("/login");
    }
  },
  methods: {
    async currentInChangeList(page, itemOutComId, dynamicIndex, indexOut) {
      //根据主评论找出相应的副评论
      await this.getViceComm(page, itemOutComId, dynamicIndex, indexOut);
    },
    //得到副评论
    async getViceComm(page, itemOutComId, dynamicIndex, indexOut) {
      //更新副评论的数量
      const { data: res1 } = await request.get(
        "/social/getDyViceCommCount/" + itemOutComId
      );
      this.dynamicMsgList[dynamicIndex].dynamicCommentList[
        indexOut
      ].totalViceComm = res1.data;
      const { data: res } = await request.get(
        "/social/getDyViceComm/" + itemOutComId,
        {
          params: { page: page },
        }
      );
      res.data.forEach((item1, index1) => {
        item1.authorImg = this.$store.getters.getHost + item1.authorImg;
        item1.pubTime = friendlyFormatTime(item1.pubTime);
      });
      //根据下标渲染到页面中去
      this.dynamicMsgList[dynamicIndex].dynamicCommentList[
        indexOut
      ].viceCommentList = res.data;
      this.$set(this.vice_page, itemOutComId, page);
    },
    async currentOutChangeList(page, dynamicId, index) {
      //更新总评论的数量
      const { data: res1 } = await request.get(
        "/social/getDyMainCommCount/" + dynamicId
      );
      this.dynamicMsgList[index].totalMainComm = res1.data;
      //获取评论数据(第page页)
      await this.showOutComm(dynamicId, page, 1, index);
    },
    async pubViceComm(itemOutComId, dynamicIndex, indexOut) {
      let val = this.$refs[`viceText${itemOutComId}`][0].placeholder;
      let content = this.$refs[`viceText${itemOutComId}`][0].value;
      let vicName = "";
      let type;
      if (val.substring(val.length - 1) == " ") {
        type = 1;
      } else {
        type = 2;
        //把回复的人的名称截取过来
        let index1 = val.indexOf("@");
        vicName = val.substring(index1 + 1, val.length - 1);
      }
      //发布消息
      if (content.trim() != "") {
        const { data: res } = await request.post(
          "/social/pubViceComm/" + itemOutComId,
          {
            viceAuthor: vicName,
            content: content,
            type: type,
          }
        );
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "评论发布成功",
            duration: 800,
          });
          this.$refs[`viceText${itemOutComId}`][0].value = "";
          //发布副评论后更新该副评论列表
          await this.getViceComm(
            this.vice_page[itemOutComId],
            itemOutComId,
            dynamicIndex,
            indexOut
          );
        } else {
          this.$message({
            type: "error",
            message: "评论发布失败",
            duration: 800,
          });
        }
      }
    },
    replyOut(author, id) {
      if (
        this.$refs[`viceText${id}`][0].placeholder ==
        "回复 @" + author + "： "
      ) {
        this.$set(this.show_vice_comments, id, !this.show_vice_comments[id]);
      } else {
        this.$set(this.show_vice_comments, id, true);
      }
      this.$nextTick(() => {
        this.$refs[`viceText${id}`][0].placeholder = "回复 @" + author + "： ";
      });
    },
    replyIn(author, id) {
      this.$set(this.show_vice_comments, id, true);
      this.$nextTick(() => {
        this.$refs[`viceText${id}`][0].placeholder = "回复 @" + author + "：";
      });
    },
    //获取动态数据出来,插入到相应动态中
    async showOutComm(dynamicId, outPage, inPage, dynamicIndex) {
      const { data: res } = await request.get(
        "/social/getDynamicComm/" + dynamicId,
        {
          params: { outPage: outPage, inPage: inPage },
        }
      );
      res.data.forEach((item, index) => {
        item.authorImg = this.$store.getters.getHost + item.authorImg;
        item.pubTime = friendlyFormatTime(item.pubTime);
        item.viceCommentList.forEach((item1, index1) => {
          item1.authorImg = this.$store.getters.getHost + item1.authorImg;
          item1.pubTime = friendlyFormatTime(item1.pubTime);
        });
        this.$set(this.vice_page, item.id, inPage);
      });
      this.$set(
        this.dynamicMsgList[dynamicIndex],
        "dynamicCommentList",
        res.data
      );
      this.$set(this.main_page, dynamicId, outPage);
    },
    showSelfComm(id, index) {
      this.$set(this.show_main_comments, id, !this.show_main_comments[id]);
      //(初始化评论数据)
      this.showOutComm(id, 1, 1, index);
    },
    async sendMainComm(dynamicId, index) {
      let content = this.$refs[`mainText${dynamicId}`][0].value;
      if (content.trim() != "") {
        //发送评论
        const { data: res } = await request.post(
          "/social/pubDynamicComm/" + dynamicId,
          qs.stringify({ content: content })
        );
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "评论发布成功",
            duration: 800,
          });
          this.$refs[`mainText${dynamicId}`][0].value = "";
          //评论发布成功后，重新渲染这个动态(重新更新该动态的列表)
          //更新总评论的数量
          const { data: res1 } = await request.get(
            "/social/getDyMainCommCount/" + dynamicId
          );
          this.dynamicMsgList[index].totalMainComm = res1.data;
          this.showOutComm(dynamicId, this.main_page[dynamicId], 1, index);
        } else {
          this.$message({
            type: "error",
            message: "评论发布失败",
            duration: 800,
          });
        }
      }
    },
    forwardWeibo(content, pubImgList, songId, pubSongName, pubSinger) {
      let url = "http://localhost:8081/index?songId=" + songId;
      let picUrl = "";
      let temp;
      pubImgList.forEach((item, index) => {
        temp = item.imgSrc.replace(
          "http://localhost:443//",
          "http://ynhhsa.natappfree.cc/"
        );
        if (index == 0) {
          picUrl = temp;
        } else {
          picUrl = picUrl + "||" + temp;
        }
      });
      if (songId != 0) {
        content +=
          "\n" + "分享歌曲链接 ----- " + pubSongName + " - " + pubSinger;
      }
      toWeibo(url, content, picUrl);
    },
    toUserHome(author) {
      this.$router.push({ path: "/home", query: { user: author } });
    },
    async getDynamicCount() {
      const { data: res } = await request.get("/social/getDynamicCount");
      this.totalDynamicNum = res.data;
    },
    initDynamicSocket(username) {
      let _this = this;
      let socketUrl = "ws://localhost:443/dynamicserver/" + username;
      if (socket != null) {
        socket.close();
        socket = null;
      }
      // 开启一个websocket服务
      socket = new WebSocket(socketUrl);
      //打开事件
      socket.onopen = function () {
        console.log("dynamicSocket已打开");
      };
      //  浏览器端收消息,获得从服务端发送过来的文本消息
      socket.onmessage = function (msg) {
        console.log(msg.data);
        _this.hasNewTip = true;
      };
      //关闭事件
      socket.onclose = function () {
        console.log("dynamicSocket已关闭");
      };
      //发生了错误事件
      socket.onerror = function () {
        console.log("dynamicSocket发生了错误");
      };
    },
    currentChange(page) {
      this.currentPage = page;
      this.showDynamic(page);
      this.hasNewTip = false;
    },
    //文件个数超出限制
    handleExceed() {
      this.$message({
        type: "error",
        message: "文件上传个数不能超过9个",
        duration: 800,
      });
    },
    //上传图片时的验证
    beforeUpload(file) {
      let isImage = false;
      const isLtM = file.size / 1024 / 1024 < 10;
      const type = file.type;
      let fdStart = type.indexOf("image/");
      if (fdStart == 0) {
        isImage = true;
      } else {
        isImage = false;
        this.$message.error("请上传图片");
      }
      if (!isLtM) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isLtM && isImage;
    },
    //移除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //看图片缩览图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //设置表情
    selectEmoji(emoji) {
      this.textarea += emoji.data;
      this.showEmoji = false;
    },
    //是否显示表情
    showEmo() {
      this.showEmoji = !this.showEmoji;
    },
    //选择歌曲的名称
    handleSelect(song) {},
    //发布动态
    async submitDynamic() {
      if (
        this.$refs.dynamicUpload.uploadFiles.length == 0 &&
        this.textarea.trim() == "" &&
        this.songName.trim() == ""
      ) {
        this.$message({
          type: "error",
          message: "上传内容不能为空",
          duration: 800,
        });
      } else if (this.$refs.dynamicUpload.uploadFiles.length == 0) {
        await this.pubDynamic();
        return;
      } else {
        //上传图片
        await this.$refs.dynamicUpload.submit();
      }
    },
    async pubDynamic() {
      const { data: res } = await request.post("/social/pubDynamic", {
        content: this.textarea,
        imgList: this.imgUrlList,
        songId: this.songId,
        songMsg: this.songName,
      });
      if (res.code == 200) {
        //上传成功后
        this.songName = "";
        this.textarea = "";
        this.$refs.dynamicUpload.clearFiles();
        this.imgUrlList = [];
        this.$message({
          type: "success",
          message: "动态发布成功",
          duration: 800,
        });
        //向后端传送一个消息
        let tip = "1";
        if (typeof WebSocket == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          // 将组装好的json发送给服务端，由服务端进行转发
          socket.send(tip);
        }
        //展示数据
        this.currentChange(1);
      } else {
        this.$message({
          type: "error",
          message: "找不到相关歌曲信息,内容为空,发布失败",
          duration: 1000,
        });
        this.$refs.dynamicUpload.clearFiles();
        this.imgUrlList = [];
        return;
      }
    },
    async handleSuccess(res, file) {
      //上传图片成功结果
      if (res.code == 200) {
        this.imgUrlList.push(res.data);
      } else {
        this.$message({
          type: "error",
          message: "服务器繁忙，请重新发布动态",
          duration: 800,
        });
        this.$refs.dynamicUpload.clearFiles();
        this.imgUrlList = [];
        return;
      }
      if (
        this.imgUrlList.length == this.$refs.dynamicUpload.uploadFiles.length
      ) {
        //发布动态，上传数据
        await this.pubDynamic();
      }
    },
    //展示出动态
    async showDynamic(page) {
      await this.getDynamicCount();
      const { data: res } = await request.get("/social/getDynamic/" + page);
      //处理图片的数据
      this.dynamicMsgList = [];
      let tempImgSrc = [];
      let tempList = [];
      let obj = {};
      let key1 = "imgSrc";
      let key2 = "srcList";
      this.$nextTick(() => {
        res.data.forEach((item) => {
          item.faceImgUrl = this.$store.getters.getHost + item.faceImgUrl;
          item.songImgUrl = this.$store.getters.getHost + item.songImgUrl;
          item.pubTime = friendlyFormatTime(item.pubTime);
          tempImgSrc = [];
          item.pubImgList.forEach((item1) => {
            let urlItem1 = this.$store.getters.getHost + item1;
            obj = new Object();
            tempList = [];
            tempList.push(urlItem1);
            obj[key1] = urlItem1;
            obj[key2] = tempList;
            tempImgSrc.push(obj);
          });
          item.pubImgList = tempImgSrc;
          this.dynamicMsgList.push(item);
        });
      });
      this.show_main_comments = [];
      this.show_vice_comments = [];
    },
    async onPlay(id) {
      //获取相应歌曲播放
      const { data: res } = await request.get("/song/getSongById/" + id);
      this.$store.commit("setIsPlay", true);
      this.$store.commit("setId", id);
      this.$store.commit("setUrl", this.$store.getters.getHost + res.data.url);
      this.$store.commit(
        "setImgUrl",
        this.$store.getters.getHost + res.data.imgUrl
      );
      this.$store.commit("setAuthor", res.data.singerName);
      this.$store.commit("setSongTitle", res.data.name);
      this.$store.commit("setLyric", res.data.lyric);
      this.$store.commit("setAlbum", res.data.album);
      //获取相应歌曲是否已经被该用户收藏
      const { data: res1 } = await request.get("/song/findCollectSong/" + id);
      if (res1.code == 200) {
        if (res1.data == 0) {
          this.$store.commit("setIsLike", false);
        } else {
          this.$store.commit("setIsLike", true);
        }
      } else {
        this.$store.commit("setIsLike", false);
      }
      //点击歌曲
      const { data: res2 } = await request.post(
        "/clickController/click/songClick",
        qs.stringify({ id: id })
      );
    },
    //查询歌曲
    querySearch(queryString, cb) {
      //修改名字后默认把歌曲id修改为0
      this.songId = 0;
      let results = [];
      //根据字符串获取歌曲的信息(歌曲+歌手)
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        //远程获取歌曲数据
        const { data: res } = await request.get("/song/getSongMsgByName", {
          params: { songName: queryString },
        });
        results = res.data;
        cb(results);
      }, 1000 * Math.random());
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/dynamic/dynamic.less";
</style>
