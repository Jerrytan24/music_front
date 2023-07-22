<template>
  <div>
    <div class="main-songList-content">
      <div class="tit_content" @click="clickShow">
        <span class="tit"> {{ selectTag }} </span>
        <i class="iconfont icon-bar_icon_arrow" v-if="showType">&#xe62c;</i>
        <i class="iconfont icon-bar_icon_arrow" v-else>&#xe62d;</i>
      </div>
      <transition name="el-zoom-in-top">
        <div class="tags" v-show="showType">
          <div class="default">
            <i class="iconfont default-tags">&#xe60e;</i>
            <span>默认</span>
          </div>
          <ul class="list_tags">
            <li
              class="item"
              :class="{ active: isActiveId == 0 }"
              @click="clickTag(0, '全部歌单')"
            >
              <span>全部歌单</span>
            </li>
          </ul>
          <div class="myTopic">
            <i class="iconfont myTopic-tags">&#xe649;</i>
            <span>主题</span>
          </div>
          <ul class="list_tags">
            <li
              class="item"
              v-for="(item, index) in topicList"
              :key="index"
              :class="{ active: item.id == isActiveId }"
              @click="clickTag(item.id, item.tag)"
            >
              <span>{{ item.tag }}</span>
            </li>
          </ul>
        </div>
      </transition>
      <!-- 放置歌单盒子组件的位置 -->
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
      </div>
      <div class="page" v-if="totalSongList != 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSongList"
          :current-page="currentPage"
          :page-size="20"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
      <div class="no-data" v-else-if="totalSongList == 0">暂无音源</div>
    </div>
  </div>
</template>

<script>
import BoxShow from "@/components/box/BoxShow.vue";
import request from "@/utils/request.js";
const qs = require("qs");
export default {
  components: {
    BoxShow,
  },
  async created() {
    await this.getTagList();
    //默认是获取全部的歌单
    this.getSongList();
  },
  data() {
    return {
      showType: false,
      topicList: [],
      totalSongList: 1,
      isActiveId: 0,
      selectTag: "全部歌单",
      currentPage: 1,
      songListArray: [],
    };
  },
  methods: {
    async getTagList() {
      const { data: res } = await request.get("/songList/getSongListTag");
      this.topicList = res.data;
    },
    clickShow() {
      this.showType = !this.showType;
    },
    //分页切换
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.getSongList();
    },
    //切换标签
    clickTag(id, name) {
      this.isActiveId = id;
      this.selectTag = name;
      this.showType = false;
      this.getSongList();
    },
    //获取歌单数据
    async getSongList() {
      if (this.isActiveId == 0) {
        //获取全部歌单的总数
        const { data: res1 } = await request.get("/songList/getAllSongListNum");
        //获取全部的歌单数据
        const { data: res } = await request.get(
          "/songList/getAllSongList/" + this.currentPage
        );
        this.totalSongList = res1.data;
        this.songListArray = res.data;
      } else {
        // 获取相应的歌单数量
        const { data: res1 } = await request.get(
          "/songList/getTagSongListNum",
          {
            params: { tagId: this.isActiveId },
          }
        );
        // 获取相应的歌单数据
        const { data: res } = await request.get(
          "/songList/getTagSongList/" + this.currentPage,
          {
            params: { tagId: this.isActiveId },
          }
        );
        this.totalSongList = res1.data;
        this.songListArray = res.data;
      }
    },
    async toSongListDetail(id) {
      this.$router.push({ path: "/songListDetail", query: { songListId: id } });
      //点击歌单
      const { data: res } = await request.post(
        "/clickController/click/songListClick",
        qs.stringify({ id: id })
      );
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/songList/songList.less";
</style>