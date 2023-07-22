<template>
  <div class="main-singer-content">
    <ul class="tag_kind">
      <li
        v-for="(item, index) in singerTag"
        :key="index"
        :class="{ active: item == isActiveName }"
        @click="changeTag(item)"
      >
        {{ item }}
      </li>
    </ul>
    <div class="singer_body">
      <div class="artist_item" v-for="(item, index) in singerList" :key="index">
        <div class="artist">
          <div class="pic_out">
            <img
              class="pic"
              v-lazy="item.pic"
              @click="toSingerDetail(item.id)"
            />
          </div>
          <p class="name">
            <span :title="item.name" class="text">{{ item.name }}</span>
          </p>
          <p class="num">{{ item.songCount }}首歌曲</p>
        </div>
      </div>
    </div>
    <div class="page" v-if="totalSingerList != 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSingerList"
        :current-page="currentPage"
        :page-size="24"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
const qs = require("qs");
export default {
  created() {
    this.getSingerList(1);
  },
  data() {
    return {
      singerTag: ["全部", "男歌手", "女歌手", "组合歌手"],
      isActiveName: "男歌手",
      currentPage: 1,
      totalSingerList: 0,
      singerList: [],
    };
  },
  methods: {
    async toSingerDetail(singerId) {
      this.$router.push({
        path: "/singerListDetail",
        query: { singerListId: singerId },
      });
      //点击歌手
      const { data: res } = await request.post(
        "/clickController/click/singerClick",
        qs.stringify({ id: singerId })
      );
    },
    currentChange(page) {
      this.getSingerList(page);
    },
    changeTag(tag) {
      this.isActiveName = tag;
      this.getSingerList(1);
    },
    async getSingerListNum() {
      const { data: res } = await request.get("/singer/getSingerListNum", {
        params: { tagName: this.isActiveName },
      });
      this.totalSingerList = res.data;
    },
    async getSingerList(page) {
      this.currentPage = page;
      //每次获取列表的时候查找总数
      await this.getSingerListNum();
      const { data: res } = await request.get("/singer/getSingerList/" + page, {
        params: { tagName: this.isActiveName },
      });
      res.data.forEach((item) => {
        item.pic = this.$store.getters.getHost + item.pic;
      });
      this.singerList = res.data;
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/singer/singer.less";
</style>