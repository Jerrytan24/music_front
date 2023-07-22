<template>
  <div>
    <div class="main-content">
      <el-tabs
        v-model="activeName"
        type="card"
        tab-position="top"
        @tab-click="handleClick"
      >
        <el-tab-pane label="歌名" name="song">
          <div class="showList">
            <div class="title">
              <ul>
                <li>序号</li>
                <li>歌名</li>
                <li>歌手</li>
                <li>专辑</li>
              </ul>
            </div>
            <div class="song_body">
              <ul>
                <li v-if="totalSong == 0" class="clearli">
                  <div class="bli">暂无音源</div>
                </li>
                <li
                  v-for="(item, index) in songList"
                  :key="item.songId"
                  @click="onPlay(item.songId)"
                  v-else
                >
                  <div>{{ index + 1 }}</div>
                  <div>{{ item.name }}</div>
                  <div>{{ item.singerName }}</div>
                  <div>{{ item.album }}</div>
                </li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="歌手" name="singer">
          <div class="showList">
            <div class="title">
              <ul>
                <li>序号</li>
                <li>歌名</li>
                <li>歌手</li>
                <li>专辑</li>
              </ul>
            </div>
            <div class="song_body">
              <ul>
                <li v-if="totalSong == 0" class="clearli">
                  <div class="bli">暂无音源</div>
                </li>
                <li
                  v-for="(item, index) in songList"
                  :key="item.songId"
                  @click="onPlay(item.songId)"
                  v-else
                >
                  <div>{{ index + 1 }}</div>
                  <div>{{ item.name }}</div>
                  <div>{{ item.singerName }}</div>
                  <div>{{ item.album }}</div>
                </li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="page">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSong"
          :page-size="8"
          :current-page="currentPage"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../components/header/Header.vue";
import request from "@/utils/request.js";
import bus from "@/plugins/eventBus.js";
import "@/assets/css/search/search.less";
const qs = require("qs");
export default {
  components: { Header },
  data() {
    return {
      activeName: "song",
      songList: [],
      totalSong: 0,
      word: "",
      currentPage: 1,
    };
  },
  created() {
    this.word = this.$route.query.word;
    bus.$on("searchResult", (val) => {
      this.word = val;
    });
    this.currentChange(1);
  },
  watch: {
    word() {
      this.currentChange(1);
    },
  },
  methods: {
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
    handleClick() {
      this.currentChange(1);
    },
    async currentChange(currentPage) {
      if (this.activeName == "song") {
        //根据歌名查询（第1页最多8条数据）
        //先查出有多少条数据
        const { data: resTotal } = await request.get(
          "/song/getAllSongNumByName",
          {
            params: { keyword: this.word },
          }
        );
        this.totalSong = resTotal.data;
        //再根据歌名查询
        const { data: res } = await request.get(
          "/song/getSongByName/" + currentPage,
          {
            params: { keyword: this.word },
          }
        );
        this.songList = res.data;
      }
      if (this.activeName == "singer") {
        //根据歌手查询(第1页最多8条数据)
        //先查出有多少条数据
        const { data: resTotal } = await request.get(
          "/song/getAllSongNumBySinger",
          {
            params: { keyword: this.word },
          }
        );
        this.totalSong = resTotal.data;
        //再根据歌手查询歌曲
        const { data: res } = await request.get(
          "/song/getSongBySinger/" + currentPage,
          {
            params: { keyword: this.word },
          }
        );
        this.songList = res.data;
      }
      this.currentPage = currentPage;
    },
  },
};
</script>