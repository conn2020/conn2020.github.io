# 视频防盗
几年前碰到过一个视频防下载的需求，当时前后台做了很多思考，最后将视频的播放放在了小程序里做，可以规避一定的视频下载风险。现在再回头看，又有了新的想法。平时报的线上架构课，都有线上点播功能，依然能做到一定程度的视频防盗。
我们在视频网站经常看到如下这种场景：

![avatar](/assets/images/001.png)

图片当中的video的src并不是我们常用的*.mp4这种格式，而是一个blob:开头的字符串，打开调试工具，能看到*.m3u8的请求和一些*.ts的请求。至少让想下载视频的用户没有直接得到视频的地址，那么这种功能要如何实现呢？
* 通过FFmpeg将mp4视频转码成多个ts片段
* nginx做视频访问服务器
* video.js播放视频
## 一、FFmpeg安装
我是在vmware的虚拟机里安装的FFmpeg，系统是centos7.8，网上有很多安装的帖子，我参考的是这篇博客：[`FFmpeg安装`](https://www.cnblogs.com/myLeisureTime/p/16955886.html)
  
安装完成后进行视频转码，现将目标mp4视频上传到服务器
```shell
ffmpeg -i input.mp4 -vcodec copy -acodec copy -bsf:v h264_mp4toannexb -hls_time 10 -hls_list_size 0 -f hls output.m3u8
```
## 二、Nginx安装
之前的文章有过介绍：[`Nginx安装`](https://www.baidu.com)
## 三、video.js播放视频
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://vjs.zencdn.net/8.6.1/video-js.css" rel="stylesheet" />
    <script src="https://vjs.zencdn.net/8.6.1/video.min.js"></script>
</head>

<body>
    <video id="my-video" class="video-js" controls preload="auto" width="640" height="264" data-setup='{}'>
        <source src="http://192.168.31.110:8081/video/output.m3u8" type='application/x-mpegURL' />
    </video>
</body>

</html>
```
视频可以播放了，但是发现单个的ts片段也可以在视频播放软件里播放，依然起不到防盗的作用，需要对ts视频进行加密。
## 四、ts视频片段加密
在mp4所在的文件夹里添加file.key和keyinfo.txt
```shell
#!/bin/sh BASE_URL=${1:-'.'}
openssl rand 16 > file.key
echo $BASE_URL/file.key > file.keyinfo
echo file.key >> file.keyinfo
echo $(openssl rand -hex 16) >> file.keyinfo
# 生成加密的ts片段
ffmpeg -i input.mp4 -vcodec copy -acodec copy -bsf:v h264_mp4toannexb -hls_key_info_file file.keyinfo -hls_time 10 -hls_list_size 0 -f hls output.m3u8
```