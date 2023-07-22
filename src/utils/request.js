import axios from 'axios'
const request = axios.create({
    baseURL: "http://localhost:443/",
})
// 添加请求拦截器，在请求头中加token
request.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });
export default request