<template>
  <div class="box-contain">
    <div class="cover">
      <span class="icon_play">
        <i class="iconfont myfont">&#xe62b;</i>
      </span>
    </div>
    <div class="scale-img">
      <img v-lazy="item.pic" />
    </div>
    <p class="review">{{ item.name }}</p>
  </div>
</template>

<script>
import "@/assets/css/boxshow/boxshow.less";
export default {
  props: {
    item: {
      type: Object,
    },
  },
};
</script>

<style>
</style>