export function toWeibo(url, title, picUrl) {
    url = encodeURIComponent(url)
    title = encodeURIComponent(title)
    window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}&pic=${picUrl}&appkey=&sudaref=`)
}