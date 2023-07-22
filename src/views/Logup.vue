<template>
  <div class="logup-contain">
    <span class="logup-sm"> Small Music</span>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
      <el-form-item label="注册昵称" prop="name" :error="errorMsg_user_info">
        <el-input
          placeholder="请输入昵称"
          v-model="ruleForm.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="注册密码" prop="password">
        <el-input
          placeholder="请输入密码"
          v-model="ruleForm.password"
          show-password
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <!-- <Vervify @verifyMsg="validateMsg"></Vervify> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmitVerify()">注册</el-button>
        <el-button type="primary" @click="goLogin()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request.js";
// import Vervify from "@/components/vervify/Vervify.vue";
import showVervifyBus from "@/plugins/eventBus.js";
import { mapGetters } from "vuex";
const qs = require("qs");
export default {
  // components: {
  //   Vervify,
  // },
  computed: {
    ...mapGetters([
      "id", //歌曲id
    ]),
  },
  data() {
    return {
      errorMsg_user_info: "",
      verification: false,
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
    goLogin() {
      this.$router.push("/login");
    },
    onSubmitVerify() {
      if (
        this.ruleForm.name.trim() == "" ||
        this.ruleForm.password.trim() == ""
      ) {
        this.$message({
          type: "error",
          message: "姓名和密码不能为空",
          duration: 800,
        });
      } else {
         this.onSubmit();
      }
    },
    validateMsg(msg) {
      if (msg == "success") {
        this.onSubmit();
        // showVervifyBus.$emit("showMyVervify", false);
      } else {
        this.$message({
          type: "error",
          message: "验证失败",
          duration: 800,
        });
      }
    },
    onSubmit() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          const { data: res } = await request.post("/user/logup", {
            username: this.ruleForm.name,
            password: this.ruleForm.password,
          });
          if (res.code == 200) {
            // 把token存入localStorage
            this.$store.commit("setToken", res.data);
            this.$notify({
              message: "注册成功",
              duration: 800,
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
            this.errorMsg_user_info = res.data;
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/logup/logup.less";
</style>