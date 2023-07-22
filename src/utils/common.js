import Axios from "axios";
//下载音乐
export const download = (url) => Axios({
    method: 'get',
    url: url,
    responseType: 'blob'
});