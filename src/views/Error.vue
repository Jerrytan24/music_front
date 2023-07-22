<template>
  <div class="main-content404">
    <div class="left404">
      <div class="code404">404</div>
      <div class="tip404">你来到了一个不该来到的地方</div>
      <el-button type="primary" @click="toIndex" class="button404">
        去往首页
      </el-button>
    </div>
    <div class="right404">
      <img src="../assets/img/error404.svg" alt="404错误" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toIndex() {
      this.$router.push({ path: "/index" });
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/error/error.less";
</style>
