<template>
  <div>
    <div class="topic">
      <!-- 个性签名 -->
      <div class="sign">
        <div class="sign-title">个性签名</div>
        <div class="sign-body">{{ signature }}</div>
        <img v-lazy="authorImg" alt="" />
      </div>
    </div>
    <div class="main-content">
      <div class="layout-favor">
        <div class="content-left">
          <div>姓名:&nbsp;{{ username }}</div>
          <div>生日:&nbsp;{{ birthDate }}</div>
          <div>性别:&nbsp;{{ gender }}</div>
          <div>地区:&nbsp;{{ area }}</div>
        </div>
        <div class="content-right">
          <el-table
            :data="tableData"
            ref="songTable"
            style="width: 100%"
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              label="序号"
              width="180"
              type="index"
              :index="indexMethod(1)"
            >
            </el-table-column>
            <el-table-column prop="singerName" label="歌手" width="180">
            </el-table-column>
            <el-table-column prop="name" label="歌名"> </el-table-column>
            <el-table-column prop="album" label="专辑"> </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button @click="deleteSelection()">删除歌曲</el-button>
          </div>
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
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import { mapGetters } from "vuex";
import "@/assets/css/favor/favor.less";
const qs = require("qs");
export default {
  data() {
    return {
      username: "",
      authorImg: "",
      gender: "",
      birthDate: "",
      area: "",
      signature: "",
      multipleSelection: [],
      totalSong: 0,
      tableData: [],
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters([
      "id", //歌曲id
    ]),
  },
  async created() {
    //获取用户信息
    const { data: res } = await request.get("/user/info");
    if (res.code == 200) {
      this.username = res.data.username;
      this.authorImg = this.$store.getters.getHost + res.data.avatar;
      this.gender = res.data.gender;
      this.birthDate = res.data.birthday;
      this.signature = res.data.signature;
      this.area = res.data.area;
      //获取用户已经收藏了的歌曲
      this.currentChange(1);
    } else {
      this.$store.commit("setErrorMsg", "请登陆后操作");
      this.$router.push("/login");
    }
  },
  methods: {
    //返回歌曲序号
    indexMethod(index) {
      return index;
    },
    //点击歌曲播放
    handleCurrentChange(val) {
      this.currentRow = val;
      this.onPlay(val.songId);
    },
    //选择到的歌曲
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //分页切换
    async currentChange(currentPage) {
      //获取相应歌曲
      const { data: res1 } = await request.get(
        "/song/getFavorSong/" + currentPage
      );
      this.tableData = res1.data;
      //获取收藏的歌曲总数
      const { data: res2 } = await request.get("/song/getAllFavorSong/");
      this.totalSong = res2.data;
      this.currentPage = currentPage;
    },
    //删除歌曲
    async deleteSelection() {
      if (this.tableData.length != 0) {
        let deleteArray = [];
        this.multipleSelection.forEach((elem, index) => {
          deleteArray.push(elem.songId);
        });
        await request.delete("/song/deleteSong", {
          data: deleteArray,
        });
        this.$message({
          type: "success",
          message: "删除成功",
          duration: 1000,
        });
        //判断删除的歌曲中是否有正在播放的歌曲，如果有，取消收藏
        let index = deleteArray.indexOf(this.id);
        if (index != -1) {
          this.$store.commit("setIsLike", false);
        }
        if (this.tableData.length == deleteArray.length) {
          if (this.currentPage == 1) {
            this.currentChange(this.currentPage);
          } else {
            this.currentChange(this.currentPage - 1);
          }
        } else {
          this.currentChange(this.currentPage);
        }
      }
    },
    //播放
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
  },
};
</script>

<style>
</style>