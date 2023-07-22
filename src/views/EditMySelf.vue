<template>
  <div>
    <div class="top-edit">
      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-lazy="imageUrl" class="avatar" />
      </el-upload>
    </div>
    <div class="editContent">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="昵称" :error="errorMsg_user_info">
          <el-input
            v-model="form.name"
            @focus="clearError"
            placeholder="请输入1到6个字符"
            maxlength="6"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择出生日期"
              v-model="form.date1"
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="籍贯">
          <el-select v-model="form.region" placeholder="请选择你的籍贯">
            <el-option
              v-for="(item, index) in regionList"
              :key="index"
              :label="item.area"
              :value="item.area"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input
            type="textarea"
            v-model="form.desc"
            maxlength="60"
            placeholder="限制字数为60"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">修改个人信息</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import "@/assets/css/edit/editMySelf.less";
import { regionList } from "@/plugins/regionList.js";
import request from "@/utils/request.js";
const qs = require("qs");
export default {
  // 在创建之前，添加body的style属性， 给花名册组件单独设置背景色
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background:#f5f5f5");
  },
  // 在销毁前，将body的style属性删除
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  },
  async created() {
    this.regionList = regionList;
    const { data: res } = await request.get("/user/info");
    this.uploadUrl = this.$store.getters.getHost + "file/upLoadFile/avatar";
    this.imageUrl = this.$store.getters.getHost + res.data.avatar;
  },
  data() {
    return {
      uploadUrl: "",
      regionList: [],
      imageUrl: "",
      errorMsg_user_info: "",
      form: {
        name: "",
        region: "",
        date1: "",
        sex: "",
        desc: "",
        userImgUrl: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      let params = new URLSearchParams();
      params.append("name", this.form.name.trim());
      params.append("region", this.form.region);
      params.append("date1", this.form.date1);
      params.append("sex", this.form.sex);
      params.append("desc", this.form.desc.trim());
      params.append("userImgUrl", this.form.userImgUrl);
      const { data: res } = await request.post(
        "/file/updateSelfMessage",
        params
      );
      if (res.code == 200) {
        this.$store.commit("deleteToken");
        this.$store.commit("setIsLike", false);
        this.$message.success("修改成功,请重新登录");
        this.$router.push("/login");
      } else {
        this.errorMsg_user_info = res.data;
        this.$message.error("修改失败");
      }
    },
    clearError() {
      this.errorMsg_user_info = "";
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.imageUrl = this.$store.getters.getHost + res.data;
        this.$message.success("上传头像成功");
        this.form.userImgUrl = res.data;
      } else {
        this.$message.error("服务器繁忙，请重新上传");
      }
    },
    beforeAvatarUpload(file) {
      let isImage = false;
      const isLtM = file.size / 1024 / 1024 < 10;
      const type = file.type;
      let fdStart = type.indexOf("image/");
      if (fdStart == 0) {
        isImage = true;
      } else {
        isImage = false;
        this.$message.error("请上传图片");
      }
      if (!isLtM) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      return isLtM && isImage;
    },
  },
};
</script>

<style scoped>
</style>