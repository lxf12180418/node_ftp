// 进入本目录，使用node show.js运行该js，然后打开index.html即可查看needShow下所有文件夹和文件
const express = require("express");
const app = new express();
const util = require("util");
const url = require("url");
const fs = require('fs');
const path = require('path');
// 引入本地创建的showPic展示图片模块
const showPic = require('./showPic');
// 引入本地创建的showVideo展示视频模块
const showVideo = require('./showVideo');
const downFile = require('./downFile');
const fileSize = require('./calcFileSize');
const currentDir = __dirname; // 获取当前文件所在目录
var dirs = {}; // 存放目录
var files = {}; // 存放文件
var lastDatas = {}; // 存放传输json数据的对象

// 设置默认展示的目录，__dirname为当前文件所在目录
const defaultPath = __dirname+'\\'+'needShow'; // 当前程序下的需要展示的目录
// 设置默认账号和密码
const user = 'test';
const pwd = 'test';

// 设置静态文件路径，在public目录下
app.use('/public', express.static('public'));

// 请求http://127.0.0.1:端口号时展示index.html
app.get('/',function(req,res){
// __dirname为当前文件所在目录
res.sendFile(__dirname+'\\index.html');
});

// 请求http://127.0.0.1:端口号/index.html时展示index.html
app.get('/index.html',function(req,res){
res.sendFile(__dirname+'\\index.html');
});

// 请求视频等其他格式资源时请求这个
app.get('/other',function(req,res){
 // 设置跨域请求头
  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有域名跨域
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

// 解析get请求参数
var param =  url.parse(req.url, true).query;
if(!param.path){
   res.send('link参数信息不存在，请检查请求的参数！');
   return;
}
var filePath = param.path; // 文件相对路径
var getUser = param.user; // 获取账号
var getPwd = param.pwd; // 获取密码

if( user != getUser || pwd != getPwd ){
    res.send("请检查账号和密码是否输入正确！");
    return ;
}


// 判断目录是否含C:或D:，含返回没有权限
if(filePath.startsWith("C:") || filePath.startsWith("D:") || filePath.startsWith("c:") || filePath.startsWith("d:")){
    res.send('没有权限访问该文件内容！');
    return ;
}
// 获取name参数对应参数值
filePath = defaultPath+filePath; // 文件绝对路径

try {
  var ext = path.extname(filePath);  // 根据文件路径读取文件后缀
} catch (error) {
  res.send('请求文件\文件夹路径有误');
  return ;
}

if (/\.(mp4|avi|wmv|mkv|flv|webm?)$/i.test(ext)) {
 // 是常见视频格式就调用视频播放接口
showVideo.readVideo(filePath,res);
  }else{
 // 是其他格式文件就调用文件下载接口
 downFile.downFile(filePath,res);
}
});

// 请求http://127.0.0.1:端口号/getDatas时，响应包含目录和文件的json对象
app.get('/getDatas',function(req,res){

// 响应数据类型、编码类型，允许跨域请求
 res.set({
    'Access-Control-Allow-Origin': '*', // 允许所有域名跨域
    'Content-Type':'application/json;charset=utf-8'
  });

// 解析 url 参数
var params = url.parse(req.url, true).query;
var link; // 获取链接
var getUser = params.user; // 获取账号
var getPwd = params.pwd; // 获取密码

if( user != getUser || pwd != getPwd ){
    res.send(JSON.stringify({"error":"请检查账号和密码是否输入正确！"}));
    return ;
}

if(!params.link){
   link = ""; // link参数值为空或无该参数时
}else{
  link = params.link; // 获取参数link的值即当前目录的链接
}

// 每一次请求获取某个目录下其他目录和文件时，把存储数据的对象都清空
del([dirs,files,lastDatas]);

// 初次加载index.html，link参数应该为空，来展示当前show.js所在目录的内容
// 判断目录是否含C:或D:，含返回没有权限
if(link.startsWith("C:") || link.startsWith("D:") || link.startsWith("c:") || link.startsWith("d:")){
    res.send(JSON.stringify({"error":"没有权限访问该目录！"}));
    return ;
}
// 前端页面首次请求，显示默认路径
if(link == ''){
   link = defaultPath; // 默认展示路径
}

console.log('前端请求的路径：'+link);// 输出前端发送要获取目录信息的目录路径

// 调用traverse函数遍历目录文件夹及其文件，默认遍历needShow目录
if(link.startsWith(defaultPath)){

  try{
   traverse(link); // 首次请求，请求默认目录
}catch(error){
   res.send('请求文件\文件夹路径有误');
   return ;
}

}else{

  try{
       traverse(defaultPath+link);  // 遍历的时候加上默认路径
}catch(error){
   res.send('请求文件\文件夹路径有误');
   return ;
}  
    
}
lastDatas['nowDir'] = link.replace(defaultPath,'\\'); // 这里把传输给前端的路径中剔除默认路径即可
lastDatas['dirs'] = dirs;
lastDatas['files'] = files;
console.log(lastDatas);
res.send(JSON.stringify(lastDatas));
res.end();
});

app.get('/content',function(req,res){
// 响应数据类型、编码类型
 res.set({
    'Access-Control-Allow-Origin': '*', // 允许所有域名跨域
    'Content-Type':'text/plain;charset=utf-8'
  });

// 解析 url 参数
var params = url.parse(req.url, true).query;
if(!params.link){
   res.send('msg:link参数信息不存在，请检查请求的参数！');
   return;
}
var link =params.link;// 获取参数link的值即当前文件的相对链接
var getUser = params.user; // 获取账号
var getPwd = params.pwd; // 获取密码

if( user != getUser || pwd != getPwd ){
    res.send("msg:请检查账号和密码是否输入正确！");
    return ;
}


// 判断目录是否含C(c):或D(d):，含返回没有权限
if(link.startsWith("C:") || link.startsWith("D:") || link.startsWith("c:") || link.startsWith("d:")){
    res.send('msg:没有权限访问该文件内容！');
    return ;
}
link  = defaultPath + link; 

// 读取到文本内容返回文本内容，文件不是文本，返回不是文本文件，出错则返回错误
// 使用path模块获取文件扩展名
try{
var extname = path.extname(link);
}catch(error){
   res.send('msg:请求文件\文件夹路径有误');
   return ;
}
// 判断扩展名是否为文本文件类型（.txt、.md、.html等）
if (/\.(txt|md|html|json|xml|js?)$/i.test(extname)) {
  // 读取文本文件
  fs.readFile(link, 'utf-8', function(err, data) {
    if (err) {
      res.send("msg:文件不存在！");
      return ;
    }else {
      res.send("text:"+data);
    }
  });
} else if(/\.(png|jpeg|jpg|gif|webp|ico?)$/i.test(extname)){
   // 读取图片文件
     res.send("img:"+showPic.getPic(link));
}else {
   // 读取视频等其他文件
  // 给客户端发送需要请求的地址
  res.send('./other?path='+link.replace(defaultPath,'')+'&user='+user+'&pwd='+pwd);
}
});	

function traverse(dir) {
  const fileList = fs.readdirSync(dir);
  fileList.forEach((file) => {
    // fullPath为每一个文件或文件夹的完整目录
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // 计算文件夹大小，四舍五入取小数点后两位
        lastFileSize = fileSize.getFileSize(1,fullPath,2);  
        // 获取文件修改时间，输出年份-月份-日期格式的时间
      var date = new Date(fs.statSync(fullPath).mtime.toISOString());
      var fileModifiedTime =`${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
      // 如果是目录，存入dirs对象。把名称、大小和修改时间存入到数组再存放到dirs的对象中
         dirs[file] = [fullPath.replace(defaultPath,''),lastFileSize,fileModifiedTime];
    }else {
      // 计算文件大小，四舍五入取小数点后两位
        lastFileSize = fileSize.getFileSize(2,fullPath,2);  
      // 获取文件修改时间，输出年份-月份-日期格式的时间
      var date = new Date(fs.statSync(fullPath).mtime.toISOString());
      var fileModifiedTime =`${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
      // 如果是文件，存入files对象。把名称、路径、大小和修改时间存入到数组再存放到files的对象中
       files[file] = [fullPath.replace(defaultPath,''), lastFileSize,fileModifiedTime];
    }
  });
console.log(dirs);
console.log(files);
  return { dirs, files };
}

// 遍历js对象的方法
for(var value in dirs){
console.log(dirs[value]+'：'+value);
}

// 清空对象存储的数据，delObj为要删除所有对象的数组
function del(delObj){
for( let v in delObj ){
   for (let prop in delObj[v]) {
  if (delObj[v].hasOwnProperty(prop)) {
    delete delObj[v][prop];
  }
}}
console.log('清空对象数据成功！');
}


var server = app.listen(80,function () {

  var host = server.address().address
  var port = server.address().port
   // 输出访问路径
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})