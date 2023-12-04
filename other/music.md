# 视频转mp3--实现听歌自由
小区的地下停车场里没有信号，车也不是经常开，隔断时间就得去打个火，没有网待个十几分钟好无聊。平时刷B站会看很多up主的歌曲视频，如果能转成mp3的话，就不会那么无聊了，正好之前装好了ffmpeg，说干就干。
## 一、缓存视频
首先找到在B站APP里缓存的视频，路径是 我的手机>Android>datatv.danmaku.bili>download... 找到某一部缓存的视频，一级级展开，最终能看到 vedio.m4s、audio.m4s、index.json，这几个文件就是我们要找的目标。
## 二、视频转换
首先将目标文件转换成mp4文件
```shell
ffmpeg -i ${target}\\video.m4s -i ${target}\\audio.m4s -codec copy ${target}\\test.mp4
```
再将mp4文件转换成mp3文件,我用的node.js,引入了fluent-ffmpeg
```javascript
const ffmpeg = require('fluent-ffmpeg')

ffmpeg(`${target}\\test.mp4`).output(`${target}\\test.mp3`)
    .noVideo()
    .format('mp3')
    .outputOptions('-ab', '192k')
    .run();
```
将生成的mp3文件存到手机，即可听歌自由了，仅限自娱自乐～