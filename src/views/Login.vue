<template>
  <div class="login-contain">
    <span class="login-sm"> Small Music</span>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-form-item label="昵称" prop="name">
        <el-input
          placeholder="请输入昵称"
          v-model="ruleForm.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :error="errorMsg_user_info">
        <el-input
          placeholder="请输入密码"
          v-model="ruleForm.password"
          show-password
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">登录</el-button>
        <el-button type="primary" @click="toLogup()">注册</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button @click="goLogin">游客进入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import "@/assets/css/login/login.less";
import request from "@/utils/request.js";
const qs = require("qs");
import { mapGetters } from "vuex";
export default {
  mounted() {
    if (
      this.$store.getters.errorMsg != "" &&
      this.$store.getters.errorMsg != null
    ) {
      this.$notify({
        message: this.$store.getters.errorMsg,
        duration: 1000,
        position: "top-right",
      });
    }
  },
  computed: {
    ...mapGetters([
      "id", //歌曲id
    ]),
  },
  data() {
    return {
      errorMsg_user_info: "",
      ruleForm: {
        name: "",
        password: "",
      },
      rules: {
        name: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
          { min: 1, max: 6, message: "长度在 1 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    toLogup() {
      this.$router.push("/logup");
    },
    onSubmit(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const { data: res } = await request.post("/user/login", {
            username: this.ruleForm.name,
            password: this.ruleForm.password,
          });
          if (res.code == 200) {
            // 把token存入localStorage
            this.$store.commit("setToken", res.data);
            this.$notify({
              message: "登录成功",
              duration: 1500,
              position: "top-right",
            });
            if (this.id != "") {
              const { data: res } = await request.get(
                "/song/findCollectSong/" + this.id
              );
              if (res.code == 200 && res.data != 0) {
                this.$store.commit("setIsLike", true);
              } else {
                this.$store.commit("setIsLike", false);
              }
            }
            this.$store.commit("setErrorMsg", "");
            this.$router.push("/index");
          } else {
            this.errorMsg_user_info = res.msg;
            this.$notify({
              message: this.errorMsg_user_info,
              duration: 1500,
              position: "top-right",
            });
          }
        } else {
          return false;
        }
      });
    },
    async onReset() {
      this.ruleForm.name = "";
      this.ruleForm.password = "";
    },
    goLogin() {
      this.$store.commit("setErrorMsg", "");
      this.$router.push({ path: "/index" });
    },
  },
};
</script>

<style>
</style>