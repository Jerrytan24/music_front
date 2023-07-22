<template>
  <div>
    <Swiper></Swiper>
    <div class="main-content">
      <div class="hot-songList">
        <h1>热门歌单</h1>
        <!-- 放置歌单盒子组件的位置 -->
        <div class="songList">
          <ul>
            <li
              v-for="item in songList"
              :key="item.id"
              @click="toSongListDetail(item.id)"
            >
              <em>
                <img class="hot" src="@/assets/img/hot.png" />
              </em>
              <BoxShow :item="item"></BoxShow>
            </li>
          </ul>
        </div>
      </div>
      <div class="hot-singerList">
        <h1 class="title">热门歌手</h1>
        <!-- 放置歌单盒子组件的位置 -->
        <div class="singerList">
          <ul>
            <li
              v-for="item in singerList"
              :key="item.id"
              @click="toSingerListDetail(item.id)"
            >
              <em>
                <img class="hot" src="@/assets/img/hot.png" />
              </em>
              <BoxShow :item="item"></BoxShow>
            </li>
          </ul>
        </div>
      </div>
      <div class="top-list self-top">
        <h1 class="title">榜首</h1>
        <div class="top">
          <div class="recommend-list">
            <el-card class="box-card">
              <h2 class="title">推荐</h2>
              <ul>
                <li
                  v-for="(item, index) in recommendList"
                  :key="index"
                  @click="onPlay(item.id)"
                >
                  <span v-if="index + 1 == 1">
                    <el-tag effect="dark" type="danger">1</el-tag>
                  </span>
                  <span v-else-if="index + 1 == 2">
                    <el-tag effect="dark" type="warning">2</el-tag>
                  </span>
                  <span v-else-if="index + 1 == 3">
                    <el-tag effect="dark" type="success">3</el-tag>
                  </span>
                  <span v-else>
                    <el-tag effect="dark">{{ index + 1 }}</el-tag>
                  </span>
                  {{ item.name }}
                </li>
              </ul>
            </el-card>
          </div>
          <div class="new-list">
            <el-card class="box-card">
              <h2 class="title">最新发布</h2>
              <ul>
                <li
                  v-for="(item, index) in newList"
                  :key="index"
                  @click="onPlay(item.id)"
                >
                  <span v-if="index + 1 == 1">
                    <el-tag effect="dark" type="danger">1</el-tag>
                  </span>
                  <span v-else-if="index + 1 == 2">
                    <el-tag effect="dark" type="warning">2</el-tag>
                  </span>
                  <span v-else-if="index + 1 == 3">
                    <el-tag effect="dark" type="success">3</el-tag>
                  </span>
                  <span v-else>
                    <el-tag effect="dark">{{ index + 1 }}</el-tag>
                  </span>
                  {{ item.name }}
                </li>
              </ul>
            </el-card>
          </div>
          <div class="hot-list">
            <el-card class="box-card">
              <h2 class="title">流行歌曲</h2>
              <ul>
                <li
                  v-for="(item, index) in hotList"
                  :key="index"
                  @click="onPlay(item.id)"
                >
                  <span v-if="index + 1 == 1">
                    <el-tag effect="dark" type="danger">1</el-tag>
                  </span>
                  <span v-else-if="index + 1 == 2">
                    <el-tag effect="dark" type="warning">2</el-tag>
                  </span>
                  <span v-else-if="index + 1 == 3">
                    <el-tag effect="dark" type="success">3</el-tag>
                  </span>
                  <span v-else>
                    <el-tag effect="dark">{{ index + 1 }}</el-tag>
                  </span>
                  {{ item.name }}
                </li>
              </ul>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/css/index/index.less";
import request from "@/utils/request.js";
import BoxShow from "@/components/box/BoxShow.vue";
const qs = require("qs");
export default {
  components: {
    BoxShow,
  },
  data() {
    return {
      //歌单列表(最多人听的)
      songList: [],
      //歌手列表(最多人听的)
      singerList: [],
      //歌曲(推荐)
      recommendList: [],
      //歌曲(最新发布的)
      newList: [],
      //歌曲(最多人听的)
      hotList: [],
    };
  },
  async created() {
    //先获取热门歌单的信息
    const { data: res } = await request.get("/songList/getHotSongList");
    this.songList = res.data;
    //获取热门歌手的信息
    const { data: res2 } = await request.get("/singer/getHotSinger");
    this.singerList = res2.data;
    console.log(res2.data)
    //获取最新发布的歌曲(8首)
    const { data: res3 } = await request.get("/song/getNewSongList");
    this.newList = res3.data;
    //获取最热门的歌曲(8首)
    const { data: res4 } = await request.get("/song/getHotSong");
    this.hotList = res4.data;
    //获取推荐的歌曲(8首)
    const { data: res5 } = await request.get("/song/getRecommendSong");
    this.recommendList = res5.data;
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
    async toSongListDetail(id) {
      this.$router.push({ path: "/songListDetail", query: { songListId: id } });
      //点击歌单
      const { data: res } = await request.post(
        "/clickController/click/songListClick",
        qs.stringify({ id: id })
      );
    },
    async toSingerListDetail(id) {
      this.$router.push({
        path: "/singerListDetail",
        query: { singerListId: id },
      });
      //点击歌手
      const { data: res } = await request.post(
        "/clickController/click/singerClick",
        qs.stringify({ id: id })
      );
    },
  },
};
</script>

<style>
</style>