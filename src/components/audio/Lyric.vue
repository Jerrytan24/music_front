<template>
  <div class="content_lyric">
    <div class="song_info">
      <a href="javascript:" class="song_info_pic">
        <img :src="imgUrl" alt="" />
      </a>
      <div class="song_info_name">
        歌曲名称：
        <a href="javascript:">{{ songTitle }}</a>
      </div>
      <div class="song_info_singer">
        歌手名：
        <a href="javascript:">{{ author }}</a>
      </div>
      <div class="song_info_ablum">
        专辑名：
        <a href="javascript:">{{ album }}</a>
      </div>
    </div>
    <div class="song_lyric_container">
      <VueScroll :ops="ops">
        <!-- 有歌词 -->
        <ul class="has-lyric" v-if="sentences.length != 0">
          <li v-for="(item, index) in sentences" :key="index">
            {{ item[1] }}
          </li>
        </ul>
        <!-- 没有歌词 -->
        <div v-else class="no-lyric">
          <span>暂无歌词</span>
        </div>
      </VueScroll>
    </div>
  </div>
</template>

<script>
import VueScroll from "vuescroll/dist/vuescroll-native";
import "@/assets/css/audio/lyric.less";
const qs = require("qs");
import { mapGetters } from "vuex";
export default {
  components: {
    VueScroll,
  },
  created() {
    //格式化歌词文件
    this.sentences = this.parseLyric(this.lyric);
  },
  data() {
    return {
      sentences: [],
      //滚动条配置
      ops: {
        mode: "native",
        locking: "true",
        bar: {
          disable: true,
        },
      },
    };
  },
  watch: {
    id() {
      this.sentences = this.parseLyric(this.lyric);
    },
    //监听时间变化歌词高亮
    currentTime() {
      //有歌词才高亮显示
      if (this.sentences.length > 0) {
        //遍历每一个句子
        for (let i = 0; i < this.sentences.length; i++) {
          //当前时间大于句子时间才显示
          if (this.currentTime >= this.sentences[i][0] - 0.6) {
            //先把所有的歌词恢复到默认样式
            for (let j = 0; j < this.sentences.length; j++) {
              document.querySelectorAll(".has-lyric li")[j].style.color =
                "#2f2f2f";
              document.querySelectorAll(".has-lyric li")[j].style.fontSize =
                "14px";
            }
            //有歌词显示高亮
            if (i >= 0) {
              document.querySelectorAll(".has-lyric li")[i].style.color =
                "#409EFF";
              document.querySelectorAll(".has-lyric li")[i].style.fontSize =
                "18px";
            }
          }
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      "id", //歌曲id
      "songTitle", //歌曲名字
      "author", //歌曲作者名称
      "album", //专辑名称
      "imgUrl", //图片地址
      "lyric", //歌词文件
      "currentTime", //当前时间
    ]),
  },
  methods: {
    parseLyric(text) {
      //返回数组
      let lyric = [];
      if (text != null && text != "") {
        //按照行划分
        let lines = text.split("\n");
        //[00:00.000]格式
        let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
        //对于歌词格式不对的直接返回
        if (!/\[.+\]/.test(text)) {
          return lyric;
        }
        //去掉前面格式不正确的行
        while (!pattern.test(lines[0])) {
          lines = lines.slice(1);
        }
        //遍历每一行，形成一个每行带着俩元素的数组，第一个元素是以秒为计算单位的时间，第二个元素是歌词
        for (let item of lines) {
          let time = item.match(pattern); //存前面的时间段
          let value = item.replace(pattern, ""); //存后面的歌词
          let t = time[0].slice(1, -1).split(":"); //取出时间，换算成数组
          if (value != "") {
            lyric.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
          }
        }
      }
      return lyric;
    },
  },
};
</script>

<style>
</style>