<template>
  <div>
    <Header :mychoice="selectView" v-if="isShow"></Header>
    <router-view></router-view>
    <MyAudio v-show="false"></MyAudio>
    <AudioBar></AudioBar>
  </div>
</template>

<script>
import MyAudio from "@/components/audio/Audio.vue";
import AudioBar from "@/components/audio/AudioBar.vue";
export default {
  data() {
    return {
      isShow: false,
      selectView: "",
    };
  },
  components: {
    MyAudio,
    AudioBar,
  },
  watch: {
    $route: {
      handler: function (route) {
        let value = route.path;
        this.isShow = true;
        if (value == "/index") {
          this.selectView = "index";
          localStorage.setItem("selectView", "index");
        } else if (value == "/songList") {
          this.selectView = "songList";
          localStorage.setItem("selectView", "songList");
        } else if (value == "/singer") {
          this.selectView = "singer";
          localStorage.setItem("selectView", "singer");
        } else if (value == "/favor") {
          this.selectView = "favor";
          localStorage.setItem("selectView", "favor");
        } else if (value == "/login" || value == "/logup") {
          this.isShow = false;
          localStorage.setItem("selectView", "login");
        } else {
          this.selectView = "";
          localStorage.setItem("selectView", "");
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
</style>