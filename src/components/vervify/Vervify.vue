<template>
  <div class="slider" v-show="showVervify">
    <div class="content">
      <div class="bg-img-div" ref="bgImgDiv">
        <img id="bg-img" :src="bgImg" alt />
      </div>
      <div class="slider-img-div" ref="sliderImgDiv">
        <img id="slider-img" :src="sliderImg" alt />
      </div>
    </div>
    <div class="slider-move">
      <div class="slider-move-track">拖动滑块完成拼图</div>
      <div
        class="slider-move-btn"
        ref="sliderMoveBtn"
        @mousedown="mousedown($event)"
        @touchstat="touchstart($event)"
      ></div>
    </div>
    <div class="bottom">
      <div class="close-btn" @click="close"></div>
      <div class="refresh-btn" @click="refresh"></div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import showVervifyBus from "@/plugins/eventBus.js";
const qs = require("qs");
let start = 0;
let startY = 0;
let currentCaptchaId = null;
let movePercent = 0;
let end = 206;
let startSlidingTime;
let entSlidingTime;
const trackArr = [];
export default {
  data() {
    return {
      bgImgWidth: "",
      bgImg: "",
      sliderImg: "",
      showVervify: true,
    };
  },
  mounted() {
    showVervifyBus.$on("showMyVervify", (val) => {
      this.showVervify = val;
      this.refreshCaptcha();
    });
    this.bgImgWidth = this.$refs.bgImgDiv.clientWidth;
    this.showVervify = false;
    this.refreshCaptcha();
  },
  methods: {
    mousedown(event) {
      startSlidingTime = new Date();
      start = event.pageX;
      startY = event.pageY;
      this.$refs.sliderMoveBtn.style.backgroundPosition = "-5px 31.0092%";
      window.addEventListener("mousemove", this.move);
      window.addEventListener("mouseup", this.up);
    },
    touchstart(event) {
      startSlidingTime = new Date();
      start = event.pageX;
      startY = event.pageY;
      if (start === undefined) {
        start = event.originalEvent.targetTouches[0].pageX;
        startY = event.originalEvent.targetTouches[0].pageY;
      }
      this.$refs.sliderMoveBtn.style.backgroundPosition = "-5px 31.0092%";
      window.addEventListener("touchmove", this.move);
      window.addEventListener("touchend", this.up);
    },
    reset() {
      if (this.$refs.sliderMoveBtn != null) {
        this.$refs.sliderMoveBtn.style.backgroundPosition = "-5px 11.79625%";
        this.$refs.sliderMoveBtn.style.transform = "translate(0px, 0px)";
      }
      if (this.$refs.sliderImgDiv != null) {
        this.$refs.sliderImgDiv.style.transform = "translate(0px, 0px)";
      }
      start = 0;
      startSlidingTime = null;
      entSlidingTime = null;
      trackArr.length = 0;
      movePercent = 0;
      currentCaptchaId = null;
      startY = 0;
    },
    move(event) {
      if (event instanceof TouchEvent) {
        event = event.touches[0];
      }
      let moveX = event.pageX - start;
      let pageX = event.pageX;
      let pageY = event.pageY;
      trackArr.push({
        x: pageX - start,
        y: pageY - startY,
        t: new Date().getTime() - startSlidingTime.getTime(),
      });
      if (moveX < 0) {
        moveX = 0;
      } else if (moveX > end) {
        moveX = end;
      }
      this.$refs.sliderMoveBtn.style.transform =
        "translate(" + moveX + "px, 0px)";
      this.$refs.sliderImgDiv.style.transform =
        "translate(" + moveX + "px, 0px)";
      movePercent = moveX / this.bgImgWidth;
    },
    up(event) {
      entSlidingTime = new Date();
      window.removeEventListener("mousemove", this.move);
      window.removeEventListener("mouseup", this.up);
      this.valid();
    },
    async refreshCaptcha() {
      const { data: res } = await request.get("/verify/gen");
      this.reset();
      currentCaptchaId = res.id;
      this.bgImg = res.captcha.backgroundImage;
      this.sliderImg = res.captcha.sliderImage;
    },
    refresh() {
      this.refreshCaptcha();
    },
    close() {
      this.showVervify = false;
    },
    async valid() {
      let sliderCaptchaTrack = {
        bgImageWidth: this.bgImgWidth,
        bgImageHeight: this.$refs.sliderImgDiv.clientHeight,
        sliderImageWidth: this.$refs.sliderImgDiv.clientWidth,
        sliderImageHeight: this.$refs.sliderImgDiv.clientHeight,
        startSlidingTime: startSlidingTime,
        entSlidingTime: entSlidingTime,
        trackList: trackArr,
      };
      const { data: res } = await request.post(
        "/verify/check/" + currentCaptchaId,
        sliderCaptchaTrack
      );
      if (res) {
        console.log("成功");
        this.$emit("verifyMsg", "success");
      } else {
        console.log("失败");
        this.$emit("verifyMsg", "error");
        this.refreshCaptcha();
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "../../assets/css/vervify/verrify.less";
</style>