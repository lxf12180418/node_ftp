// 流媒体，即客户端边播放边缓冲，服务器端读取一部分数据就发送一部分数据到客户端。
// BUG：有一部分浏览器只能播放音频或直接触发下载
/*
本模块是根据视频路径读取图片转码成Base64编码并输出img元素的
食用方法：
1、引入该模块
const showPic = require('./showPic'); （单引号为该js模块路径）
2、使用方法获取图片的html，返回值为字符串类型的图片html
showPic.getPic(图片路径);
*/
var fs = require('fs'); 
var http = require('http');
var path = require("path");

// 读取视频方法
exports.readVideo = function (filename, response) { 

if ( !filename || !fs.existsSync(filename)) {
response.writeHead(404); 
response.end(); 
return; 
} 
 
var readStream = fs.ReadStream(filename); 
// 设置响应内容类型
var contentType = ''; 
// 取视频文件后缀
var ext = path.extname(filename); 
console.log("视频文件后缀："+ext);
switch (ext) { 
case ".mp4":
contentType = "video/mp4"; 
break;
case ".avi":
contentType = "video/avi"; 
break;
case ".wmv":
contentType = "video/wmv"; 
break;
case ".mkv":
contentType = "video/mkv"; 
break;
case ".flv": 
contentType = "video/flv"; 
break; 
} 
 
response.writeHead(200, { 
'Content-Type' : contentType, 
'Accept-Ranges' : 'bytes'
}); 
 
// 当读入流读取视频完毕时，响应到前端就结束啦 
readStream.on('close', function() { 
response.end(); 
}); 
// 管道流，把读入流中的数据输出到写出流中
readStream.pipe(response); 
}