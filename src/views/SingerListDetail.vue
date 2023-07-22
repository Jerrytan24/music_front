<template>
  <div>
    <div class="singerMsg">
      <div class="singer_info">
        <div class="singer_img">
          <img v-lazy="pic" />
        </div>
        <div class="singer_detail_msg">
          <p class="singer_name">{{ name }}</p>
          <div class="singer_song_num">
            <span>
              单曲：
              <span class="num">{{ songNum }}</span>
            </span>
            <span>
              专辑：
              <span class="num">{{ albumNum }}</span>
            </span>
          </div>
          <div class="singer_contro">
            <span>
              地区：
              <span class="area">{{ location }}</span>
            </span>
          </div>
          <div class="btns">
            <button class="playAll" @click="playAllSong">
              <i class="iconfont">&#xea6d;</i>
              <span>播放全部</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="main_con">
      <div class="con_tags">
        <span
          v-for="(item, index) in tags"
          :key="index"
          :class="{ active: item == activeName }"
          @click="changeTags(item)"
          >{{ item }}</span
        >
      </div>
      <div class="con_body">
        <div class="con_song" v-if="activeName == '单曲'">
          <div class="list-head" v-if="totalSong != 0">
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
        <div class="con_album" v-if="activeName == '专辑'">
          <div class="song_List">
            <ul>
              <li
                v-for="item in songListArray"
                :key="item.id"
                @click="toSongListDetail(item.id)"
              >
                <BoxShow :item="item"></BoxShow>
              </li>
            </ul>
            <div class="page" v-if="albumNum != 0">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="albumNum"
                :page-size="24"
                :current-page="song_list_currentPage"
                @current-change="currentChangeList"
              >
              </el-pagination>
            </div>
            <div class="no-data" v-else-if="albumNum == 0">暂无音源</div>
          </div>
        </div>
        <div class="con_introduction" v-if="activeName == '个人简介'">
          {{ introduction }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import { download } from "@/utils/common.js";
import BoxShow from "@/components/box/BoxShow.vue";
import { mapGetters } from "vuex";
const qs = require("qs");
export default {
  components: {
    BoxShow,
  },
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
      activeName: "单曲",
      tags: ["单曲", "专辑", "个人简介"],
      songArray: [],
      songListArray: [],
      currentPage: 1,
      song_list_currentPage: 1,
      totalSong: 0,
      isActiveId: -1,
      singerListId: "",
      pic: "",
      name: "",
      songNum: "",
      albumNum: "",
      location: "",
      introduction: "",
    };
  },
  async created() {
    this.singerListId = this.$route.query.singerListId;
    if (this.singerListId == "" || this.singerListId == null) {
      this.$router.push({ path: "/index" });
    } else {
      //获取歌手的信息
      await this.getSingerListDetail();
      //获取该歌手的歌曲总数
      this.getCountBySingerListId();
      //获取歌手对应的歌曲信息(分页)
      this.getSongBySingerListId();
      //获取专辑(分页)
      this.getSongList();
    }
  },
  methods: {
    async toSongListDetail(id) {
      this.$router.push({ path: "/songListDetail", query: { songListId: id } });
      //点击歌单
      const { data: res } = await request.post(
        "/clickController/click/songListClick",
        qs.stringify({ id: id })
      );
    },
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
    async getCountBySingerListId() {
      const { data: res } = await request.get(
        "/singer/getCountBySingerListId",
        {
          params: { singerListId: this.singerListId },
        }
      );
      this.totalSong = res.data;
    },
    async getSongBySingerListId() {
      const { data: res } = await request.get(
        "/singer/getSongBySingerListId/" + this.currentPage,
        {
          params: { singerListId: this.singerListId },
        }
      );
      this.songArray = res.data;
    },
    async getSingerListDetail() {
      //根据歌手id获取相应的信息
      const { data: res } = await request.get("/singer/getSingerListDetail", {
        params: { singerListId: this.singerListId },
      });
      this.pic = res.data.pic;
      this.name = res.data.name;
      this.songNum = res.data.songNum;
      this.albumNum = res.data.albumNum;
      this.location = res.data.location;
      this.introduction = res.data.introduction;
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
      this.getSongBySingerListId();
    },
    currentChangeList(page) {
      this.song_list_currentPage = song_list_currentPage;
      this.getSongList();
    },
    async getSongList() {
      //根据歌手的id获取专辑列表
      const { data: res } = await request.get(
        "/songList/getSongListBySingerId/" + this.song_list_currentPage,
        {
          params: { singerListId: this.singerListId },
        }
      );
      this.songListArray = res.data;
    },
    changeTags(name) {
      this.activeName = name;
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/singer/singerListDetail.less";
</style>