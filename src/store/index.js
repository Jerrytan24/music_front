const index = {
    state: {
        Host: 'http://localhost:443/',//主机地址
        token: localStorage.getItem('token'), // 存储token
        errorMsg: "",//登录错误信息
    },
    getters: {
        getHost: (state) => {
            return state.Host;
        },
        getToken: (state) => {
            return state.token;
        },
        errorMsg: (state) => {
            return state.errorMsg;
        },
    },
    mutations: {
        // 修改token，并将token存入localStorage
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        // 删除token
        deleteToken(state) {
            state.token = null;
            localStorage.removeItem("token")
        },
        //登录错误信息
        setErrorMsg(state, error) {
            state.errorMsg = error;
        },
    }
}

export default index