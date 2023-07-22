const song = {
    state: {
        id: '',         //歌曲id
        songList: [],   //当前歌曲列表
        isPlay: false,  //是否播放中
        url: '',        //歌曲地址
        imgUrl: 'http://localhost:443/img/default.png',    //歌曲图片封面
        author: '',       //歌曲作者名字
        songTitle: '无',     //歌曲名字
        album: '',          //歌曲所在专辑名称
        duration: 0,       //歌曲持续时间
        currentTime: 0,  //当前时间
        playIcon: '',       //播放状态图标
        changeTime: 0,   //改变播放时间
        isChange: false,  //判断是否在拖拽进度条
        volume: 30, //音量默认为30
        lyric: '',  //歌词文件
        isLike: '', //收藏
        playIndex: -1, //播放位置
        autoPlay: false, //自动播放
    },
    getters: {
        playIndex: (state) => {
            let playIndex = state.playIndex;
            if (playIndex == -1) {
                playIndex = sessionStorage.getItem('playIndex');
                if (playIndex == null) {
                    playIndex = -1
                }
            }
            return playIndex;
        },
        autoPlay: (state) => {
            let autoPlay = state.autoPlay;
            return autoPlay;
        },
        songList: (state) => {
            let songList = state.songList;
            if (songList.length == 0) {
                songList = JSON.parse(window.sessionStorage.getItem('songList') || null);
                if (songList == null) {
                    songList = [];
                }
            }
            return songList;
        },
        isPlay: (state) => {
            let isPlay = state.isPlay;
            return isPlay;
        },
        url: (state) => {
            let url = state.url;
            if (url == "") {
                url = JSON.parse(window.sessionStorage.getItem('url') || null);
            }
            return url;
        },
        id: (state) => {
            let id = state.id;
            if (id == "") {
                id = JSON.parse(window.sessionStorage.getItem('id') || null);
                if (id == null) {
                    id = state.id;
                }
            }
            return id;
        },
        imgUrl: (state) => {
            let imgUrl = state.imgUrl;
            if (imgUrl == "http://localhost:443/img/default.png") {
                imgUrl = JSON.parse(window.sessionStorage.getItem('imgUrl') || null);
                if (imgUrl == null) {
                    imgUrl = state.imgUrl;
                }
            }
            return imgUrl;
        },
        author: (state) => {
            let author = state.author;
            if (author == "") {
                author = JSON.parse(window.sessionStorage.getItem('author') || null);
            }
            return author;
        },
        songTitle: (state) => {
            let songTitle = state.songTitle;
            if (songTitle == '无') {
                songTitle = JSON.parse(window.sessionStorage.getItem('songTitle') || null);
                if (songTitle == null) {
                    songTitle = "无";
                }
            }
            return songTitle;
        },
        duration: (state) => {
            let duration = state.duration;
            if (duration == 0) {
                duration = JSON.parse(window.sessionStorage.getItem('duration'));
            }
            return duration;
        },
        currentTime: (state) => {
            let currentTime = state.currentTime;
            return currentTime;
        },
        playIcon: (state) => {
            let playIcon = state.playIcon;
            return playIcon;
        },
        changeTime: (state) => {
            let changeTime = state.changeTime;
            return changeTime;
        },
        isChange: (state) => {
            let isChange = state.isChange;
            return isChange;
        },
        volume: (state) => {
            let volume = state.volume;
            if (volume == 30) {
                volume = JSON.parse(window.sessionStorage.getItem('volume') || null);
                if (volume == null) {
                    volume = state.volume;
                }
            }
            return volume;
        },
        lyric: (state) => {
            let lyric = state.lyric;
            if (lyric.length == 0) {
                lyric = JSON.parse(window.sessionStorage.getItem('lyric') || null);
            }
            return lyric;
        },
        album: (state) => {
            let album = state.album;
            if (album == "") {
                album = JSON.parse(window.sessionStorage.getItem('album') || null);
            }
            return album;
        },
        isLike: (state) => {
            let isLike = state.isLike;
            if (isLike == '') {
                isLike = JSON.parse(window.sessionStorage.getItem('isLike') || null);
                if (isLike == null) {
                    isLike = state.isLike;
                }
            }
            return isLike;
        }
    },
    mutations: {
        setPlayIndex: (state, playIndex) => {
            state.playIndex = playIndex;
            window.sessionStorage.setItem('playIndex', JSON.stringify(playIndex));
        },
        setAutoPlay: (state, autoPlay) => {
            state.autoPlay = autoPlay;
            window.sessionStorage.setItem('autoPlay', JSON.stringify(autoPlay));
        },
        setSongList: (state, songList) => {
            state.songList = songList;
            window.sessionStorage.setItem('songList', JSON.stringify(songList));
        },
        setIsPlay: (state, isPlay) => {
            state.isPlay = isPlay;
            window.sessionStorage.setItem('isPlay', JSON.stringify(isPlay));
        },
        setUrl: (state, url) => {
            state.url = url;
            window.sessionStorage.setItem('url', JSON.stringify(url));
        },
        setId: (state, id) => {
            state.id = id;
            window.sessionStorage.setItem('id', JSON.stringify(id));
        },
        setImgUrl: (state, imgUrl) => {
            state.imgUrl = imgUrl;
            window.sessionStorage.setItem('imgUrl', JSON.stringify(imgUrl));
        },
        setAuthor: (state, author) => {
            state.author = author;
            window.sessionStorage.setItem('author', JSON.stringify(author));
        },
        setSongTitle: (state, songTitle) => {
            state.songTitle = songTitle;
            window.sessionStorage.setItem('songTitle', JSON.stringify(songTitle));
        },
        setDuration: (state, duration) => {
            state.duration = duration;
            window.sessionStorage.setItem('duration', JSON.stringify(duration));
        },
        setCurrentTime: (state, currentTime) => {
            state.currentTime = currentTime;
            window.sessionStorage.setItem('currentTime', JSON.stringify(currentTime));
        },
        setPlayIcon: (state, playIcon) => {
            state.playIcon = playIcon;
            window.sessionStorage.setItem('playIcon', JSON.stringify(playIcon));
        },
        setChangeTime: (state, changeTime) => {
            state.changeTime = changeTime;
            window.sessionStorage.setItem('changeTime', JSON.stringify(changeTime));
        },
        setIsChange: (state, isChange) => {
            state.isChange = isChange;
            window.sessionStorage.setItem('isChange', JSON.stringify(isChange));
        },
        setVolume: (state, volume) => {
            state.volume = volume;
            window.sessionStorage.setItem('volume', JSON.stringify(volume));
        },
        setLyric: (state, lyric) => {
            state.lyric = lyric;
            window.sessionStorage.setItem('lyric', JSON.stringify(lyric));
        },
        setAlbum: (state, album) => {
            state.album = album;
            window.sessionStorage.setItem('album', JSON.stringify(album));
        },
        setIsLike: (state, isLike) => {
            state.isLike = isLike;
            window.sessionStorage.setItem('isLike', JSON.stringify(isLike));
        },
    }
}

export default song