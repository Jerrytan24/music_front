<template>
  <div>
    <div class="songListDetail-contain">
      <div class="left-introduction">
        <div class="img_out">
          <img v-lazy="imgUrl" />
        </div>
        <p class="intr">歌单简介</p>
        <p class="intr-text">{{ songListIntro }}</p>
      </div>
      <div class="right-list">
        <p class="song-list-name">{{ songListTitle }}</p>
        <p class="song-list-tag">{{ tags }}</p>
        <div class="btns">
          <button class="playAll" @click="playAllSong">
            <i class="iconfont">&#xea6d;</i>
            <span>播放全部</span>
          </button>
        </div>
        <div class="song-list">
          <div class="list-head">
            <ul class="flex_c">
              <li class="head_num">序号</li>
              <li class="head_name">歌曲</li>
              <li class="head_artist">歌手</li>
            </ul>
          </div>
          <ul class="album_list">
            <li
              class="song_item"
              v-for="(item, index) in songArray"
              :key="item.songId"
              :class="{ active: item.songId == isActiveId }"
            >
              <div class="serial_number">{{ index + 1 }}</div>
              <div class="song_title">{{ item.name }}</div>
              <div class="singer">{{ item.singerName }}</div>
              <div class="operate">
                <span
                  class="iconfont playIcon"
                  v-if="isPlay && item.songId == id"
                  @click="clickPlaySong(item.songId, '播放中')"
                >
                  &#xe629;
                </span>
                <span
                  class="iconfont playIcon"
                  v-else
                  @click="clickPlaySong(item.songId, '暂停中')"
                >
                  &#xea6e;
                </span>
                <span
                  class="iconfont downLoadIcon"
                  @click="
                    downLoadSong2(item.songUrl, item.name, item.singerName)
                  "
                  >&#xe668;
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="sld_page" v-if="totalSong != 0">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalSong"
            :page-size="10"
            :current-page="currentPage"
            @current-change="currentChange"
          >
          </el-pagination>
        </div>
        <div v-else class="no-music">暂无音源</div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import { download } from "@/utils/common.js";
import { mapGetters } from "vuex";
const qs = require("qs");
export default {
  computed: {
    ...mapGetters([
      "id", //歌曲id
      "url", //歌曲地址
      "isPlay", //播放状态
      "playIndex", //播放位置
      "songList", //歌曲列表
    ]),
  },
  watch: {
    isPlay() {
      if (this.isPlay) {
        if (this.id != "" && this.id != null) {
          this.isActiveId = this.id;
        }
      } else {
        this.isActiveId = -1;
      }
    },
    id() {
      if (this.id != "" && this.id != null) {
        this.isActiveId = this.id;
      } else {
        this.isActiveId = -1;
      }
    },
  },
  data() {
    return {
      imgUrl: "",
      songListIntro: "",
      songListTitle: "",
      songListId: "",
      tags: "",
      currentPage: 1,
      totalSong: 0,
      songArray: [],
      isActiveId: -1,
    };
  },
  async created() {
    this.songListId = this.$route.query.songListId;
    if (this.id != null && this.id != "" && this.isPlay == true) {
      this.isActiveId = this.id;
    }
    if (this.songListId == "" || this.songListId == null) {
      this.$router.push({ path: "/index" });
    } else {
      //获取歌单的信息
      await this.getSongListDetail();
      //获取该歌单的歌曲总数
      this.getCountBySongListId();
      //获取歌单对应的歌曲信息(分页)
      this.getSongBySongListId();
    }
  },
  methods: {
    playAllSong() {
      //播放全部音乐
      if (this.songArray.length != 0) {
        //从头部开始加音乐
        let tempList = this.songList;
        let myindex = 0;
        let flag = false;
        this.songArray.forEach((item1) => {
          if (this.songList != null) {
            this.songList.forEach((item2) => {
              if (item1.songId == item2.songId) {
                flag = true;
              }
            });
          }
          if (flag == false) {
            tempList.splice(myindex, 0, item1);
            myindex++;
          }
          flag = false;
        });
        this.$store.commit("setSongList", tempList);
        //从第0首开始播放
        this.onPlay(this.songArray[0].songId);
        let thisId = this.songArray[0].songId;
        //找出播放的那一首歌
        this.songList.forEach((item, index) => {
          if (item.songId == thisId) {
            this.$store.commit("setPlayIndex", index);
          }
        });
      }
    },
    downLoadSong2(songUrl, name, singerName) {
      if (songUrl != null) {
        //下载歌曲
        download(songUrl)
          .then((res) => {
            let content = res.data;
            let eleLink = document.createElement("a");
            eleLink.download = name + "-" + singerName + ".mp3";
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
    async getCountBySongListId() {
      const { data: res } = await request.get(
        "/songList/getCountBySongListId",
        {
          params: { songListId: this.songListId },
        }
      );
      this.totalSong = res.data;
    },
    async getSongBySongListId() {
      const { data: res } = await request.get(
        "/songList/getSongBySongListId/" + this.currentPage,
        {
          params: { songListId: this.songListId },
        }
      );
      this.songArray = res.data;
    },
    async getSongListDetail() {
      //根据歌单id获取相应的信息
      const { data: res } = await request.get("/songList/getSongListById", {
        params: { songListId: this.songListId },
      });
      this.imgUrl = res.data.pic;
      this.songListIntro = res.data.introduction;
      this.songListTitle = res.data.name;
      this.tags = res.data.tags;
    },
    clickPlaySong(songId, value) {
      if (value == "播放中") {
        this.isActiveId = -1;
        this.$store.commit("setIsPlay", false);
      } else if (value == "暂停中") {
        this.isActiveId = songId;
        this.onPlay(songId);
        this.$store.commit("setIsPlay", true);
      }
    },
    //分页切换
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.getSongBySongListId();
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/songList/songListDetail.less";
</style>