<template>
  <div class="MyAudio">
    <audio
      ref="player"
      :src="url"
      controls="controls"
      preload="true"
      @canplay="startPlay"
      @ended="ended"
      @timeupdate="timeUpdate"
    ></audio>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "@/assets/css/audio/audio.less";
export default {
  computed: {
    ...mapGetters([
      "id", //歌曲id
      "url", //歌曲地址
      "isPlay", //播放状态
      "changeTime", //改变播放进度时间
      "isChange", //判断是否在拖动进度条
      "volume", //音量大小设置
      "autoPlay", //自动播放
    ]),
  },
  watch: {
    isPlay() {
      if (this.isPlay) {
        this.$refs.player.play();
        this.$store.commit("setDuration", this.$refs.player.duration);
      } else {
        this.$refs.player.pause();
      }
    },
    changeTime() {
      this.$refs.player.currentTime = this.changeTime;
      this.$store.commit("setIsPlay", true);
    },
    volume() {
      this.$refs.player.volume = this.volume;
    },
  },
  methods: {
    startPlay() {
      this.$store.commit("setDuration", this.$refs.player.duration);
      if (this.isPlay == true) {
        this.$refs.player.play();
      }
    },
    ended() {
      this.$store.commit("setIsPlay", false);
      this.$store.commit("setAutoPlay", (this.autoPlay = !this.autoPlay));
    },
    timeUpdate() {
      if (this.isChange == true) {
        return;
      }
      this.$store.commit("setCurrentTime", this.$refs.player.currentTime);
    },
  },
};
</script>

<style></style>
