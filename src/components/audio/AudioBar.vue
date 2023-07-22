<template>
  <div class="audioBar">
    <div class="main-content">
      <!-- 前三个播放按钮 -->
      <div class="prePlay">
        <span @click="pre"></span>
        <span @click="clickPlay">{{ playIcon }}</span>
        <span @click="next"></span>
      </div>
      <!-- 图片，歌曲，歌手和进度条 -->
      <div class="progress">
        <!-- 图片 -->
        <img :src="imgUrl" @click="toLyric" />
        <div class="progress-bar">
          <!-- 歌曲和歌手 -->
          <!-- 进度条 -->
          <div class="block">
            <span class="demonstration"
              >{{ songTitle }} &nbsp;&nbsp;{{ author }}</span
            >
            <el-slider
              v-model="value"
              :format-tooltip="formatTooltip"
              @change="changeBar"
              @mousedown.native="changeTimeTrue"
              @mouseup.native="changeTimeFalse"
            ></el-slider>
          </div>
        </div>
      </div>
      <span class="time">{{ formatCurrentTime }} / {{ formatDuration }}</span>
      <div class="my-control">
        <div class="volume">
          <!-- 音量 -->
          <div class="block">
            <el-slider
              v-model="volValue"
              vertical
              height="55px"
              @change="changeVolume"
            >
            </el-slider>
          </div>
          <span class="volume-icon"></span>
        </div>
        <transition name="slide-fade" mode="out-in">
          <span class="like" v-if="isLike" key="like" @click="clickLike"
            ></span
          >
          <span class="unlike" v-else key="unlike" @click="clickLike"></span>
        </transition>
        <span @click="downLoadSong"></span>
        <span @click="getsongList"></span>
        <transition name="el-zoom-in-bottom">
          <div class="my_song_list" v-if="showSongList">
            <div class="list_top">
              <span class="list_text"> 播放列表 </span>
              <span class="list_num">
                (共{{ songList == null ? 0 : songList.length }}首)
              </span>
              <span class="list_clear" @click="deleteAllSong">
                <i class="iconfont">&#xe616;</i>
                清空列表
              </span>
            </div>
            <div class="my_list_body">
              <AudioBarVueScroll :ops="scrollOps">
                <ul class="album_list">
                  <li
                    class="song_item"
                    v-for="(item, index) in songList"
                    :key="item.songId"
                    @click="prePlay(item.songId, index)"
                    :class="{ active: item.songId == isActiveId }"
                  >
                    <div class="serial_number">
                      {{ index + 1 }}
                    </div>
                    <div class="song_title">
                      {{ item.name }}
                    </div>
                    <div class="singer">
                      {{ item.singerName }}
                    </div>
                    <div
                      class="iconfont delete_song"
                      @click.stop="deleteSong(item.songId, index)"
                    >
                      &#xe645;
                    </div>
                  </li>
                </ul>
              </AudioBarVueScroll>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/css/audio/audioBar.less";
import request from "@/utils/request.js";
import AudioBarVueScroll from "vuescroll/dist/vuescroll-native";
import { download } from "@/utils/common.js";
const qs = require("qs");
import { mapGetters } from "vuex";
export default {
  async mounted() {
    let songId = this.$route.query.songId;
    if (songId != 0 && songId != null) {
      //播放歌曲
      await this.onPlay(songId);
      this.$store.commit("setIsPlay", false);
    }
    this.formatDuration = this.formatTime(this.duration);
  },
  computed: {
    ...mapGetters([
      "id", //歌曲id
      "songTitle", //歌曲名字
      "author", //作者名字
      "url", //歌曲地址
      "isPlay", //播放状态
      "imgUrl", //图片地址
      "currentTime", //当前时间
      "duration", //持续时间
      "playIcon", //播放状态图标
      "isLike", //收藏
      "songList", //歌曲列表
      "playIndex", //播放列表的播放位置
      "autoPlay", //播放列表的自动播放
    ]),
  },
  components: {
    AudioBarVueScroll,
  },
  watch: {
    autoPlay() {
      this.next();
    },
    id() {
      this.isActiveId = this.id;
    },
    isPlay() {
      if (this.isPlay) {
        this.$store.commit("setPlayIcon", "");
      } else {
        this.$store.commit("setPlayIcon", "");
      }
    },
    currentTime() {
      this.value =
        (parseFloat(this.currentTime) / parseFloat(this.duration)) * 100;
      this.formatDuration = this.formatTime(this.duration);
      this.formatCurrentTime = this.formatTime(this.currentTime);
    },
  },
  data() {
    return {
      value: 0,
      volValue: 30,
      formatDuration: "00:00",
      formatCurrentTime: "00:00",
      showSongList: false,
      isActiveId: 0,
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
    deleteSong(songId, index) {
      let tempList = [];
      this.songList.forEach((item) => {
        if (item.songId != songId) {
          tempList.push(item);
        }
      });
      this.$store.commit("setSongList", tempList);
      if (tempList.length == 0) {
        this.$store.commit("setPlayIndex", -1);
        this.$store.commit("setIsPlay", false);
        return;
      }
      //跳转到下一首
      if (this.playIndex > index) {
        this.$store.commit("setPlayIndex", this.playIndex - 1);
      } else if (this.playIndex == index) {
        this.$store.commit("setPlayIndex", this.playIndex - 1);
        this.next();
      }
    },
    deleteAllSong() {
      let tempList = [];
      this.$store.commit("setSongList", tempList);
      this.$store.commit("setPlayIndex", -1);
      this.$store.commit("setIsPlay", false);
    },
    pre() {
      let myIndex = Number(this.playIndex);
      if (this.songList.length > 1) {
        if (myIndex > 0) {
          this.$store.commit("setPlayIndex", myIndex - 1);
        } else if (myIndex == 0) {
          this.$store.commit("setPlayIndex", this.songList.length - 1);
        }
        myIndex = Number(this.playIndex);
        this.onPlay(this.songList[myIndex].songId);
      }
    },
    next() {
      let myIndex = Number(this.playIndex);
      if (this.songList.length > 0) {
        if (this.songList.length == 1) {
          this.$store.commit("setPlayIndex", 0);
        } else if (this.songList.length > 1) {
          if (this.songList.length - 1 > myIndex) {
            this.$store.commit("setPlayIndex", myIndex + 1);
          } else if (myIndex == this.songList.length - 1) {
            this.$store.commit("setPlayIndex", 0);
          }
        }
        myIndex = Number(this.playIndex);
        this.onPlay(this.songList[myIndex].songId);
      }
    },
    prePlay(songId, index) {
      this.$store.commit("setPlayIndex", index);
      console.log(songId);
      this.onPlay(songId);
    },
    async onPlay(id) {
      //获取相应歌曲播放
      const { data: res } = await request.get("/song/getSongById/" + id);
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
      this.$store.commit("setIsPlay", true);
    },
    getsongList() {
      this.showSongList = !this.showSongList;
    },
    formatTooltip(val) {
      return parseInt(val) + "%";
    },
    clickPlay() {
      this.$store.commit("setIsPlay", !this.isPlay);
    },
    downLoadSong() {
      if (this.url != null) {
        //下载歌曲
        download(this.url)
          .then((res) => {
            let content = res.data;
            let eleLink = document.createElement("a");
            eleLink.download = `${this.author}-${this.songTitle}.mp3`;
            eleLink.style.display = "none";
            //把字符内容转换成blob地址
            let blob = new Blob([content]);
            eleLink.href = URL.createObjectURL(blob);
            //把链接地址加到document里
            document.body.appendChild(eleLink);
            //触发点击
            eleLink.click();
            //然后移除掉这个新加的控件
            document.body.removeChild(eleLink);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    formatTime(date) {
      let result = "";
      let time = parseInt(date);
      let hour = parseInt(time / 3600); //小时
      let minute = parseInt((time / 60) % 60); //分钟
      let second = parseInt(time % 60); //秒
      if (hour > 0) {
        if (hour < 10) {
          result = "0" + hour + ":";
        } else {
          result = hour + ":";
        }
      }
      if (minute > 0) {
        if (minute < 10) {
          result += "0" + minute + ":";
        } else {
          result += minute + ":";
        }
      } else {
        result += "00:";
      }
      if (second > 0) {
        if (second < 10) {
          result += "0" + second;
        } else {
          result += second;
        }
      } else {
        result += "00";
      }
      return result;
    },
    //改变进度条
    changeBar(val) {
      // 获取到进度条的值
      let bValue = parseFloat(val);
      let changeTime = (bValue / 100) * parseFloat(this.duration);
      this.$store.commit("setChangeTime", changeTime);
      this.$store.commit("setIsChange", false);
    },
    //改变音量条
    changeVolume(val) {
      this.$store.commit("setVolume", val / 100);
    },
    changeTimeTrue() {
      this.$store.commit("setIsChange", true);
    },
    changeTimeFalse() {
      this.$store.commit("setIsChange", false);
    },
    toLyric() {
      this.$router.push({ path: "/detail" });
    },
    async clickLike() {
      if (this.id != "") {
        //收藏
        if (this.isLike == false) {
          const { data: res1 } = await request.post(
            "/song/addCollectSong/" + this.id
          );
          if (res1.code == 200) {
            this.$store.commit("setIsLike", true);
            this.$message({
              type: "success",
              message: "收藏成功",
              duration: 1000,
            });
          } else {
            this.$message({
              type: "error",
              message: "请登陆后收藏",
              duration: 1000,
            });
          }
        } else if (this.isLike == true) {
          //取消收藏
          const { data: res2 } = await request.delete(
            "/song/deleteCollectSong/" + this.id
          );
          if (res2.code == 200) {
            this.$store.commit("setIsLike", false);
            this.$message({
              type: "success",
              message: "取消收藏",
              duration: 1000,
            });
          }
        }
      }
    },
  },
};
</script>

<style></style>
