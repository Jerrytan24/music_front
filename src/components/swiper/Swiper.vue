<template>
  <div class="swiper-contain">
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide v-for="(item, index) in swiperList" :key="index"
        ><img :src="item.pic" />
      </swiper-slide>
      <div
        class="swiper-pagination"
        slot="pagination"
        v-for="(item, index) in swiperList"
        :key="index"
      ></div>
    </swiper>
    <div class="mask_bg"></div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import { swiperList } from "@/plugins/swiper/swiper-data.js";
import "@/assets/css/swiper/swiper.less";
export default {
  name: "MySwiper",
  components: {
    Swiper,
    SwiperSlide,
  },
  created() {
    this.swiperList = swiperList;
  },
  data() {
    return {
      swiperList: [],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
        },
        loop: true,
        autoplay: {
          delay: 2000,
          //当选择其他图片时，还可以循环播放
          disableOnInteraction: false,
        },
      },
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>