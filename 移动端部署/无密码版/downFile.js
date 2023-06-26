/*
这是提供文件下载的模块
需要参数：file即文件路径（包含文件名）、res（express框架搭建WEB服务器的res）
*/
const fs = require('fs');

exports.downFile = function (file,res){
// 把文件路径根据“\”进行分割，获取数组最后一个元素即文件名
const a = file.split("\\");
// 获取文件名
const fileName = a[a.length-1];
// 获取文件路径
const filePath = file.replace(fileName,'');
const fileStream = fs.createReadStream(file);
const encodedFileName = encodeURIComponent(fileName); // 将文件名编码
res.writeHead(200,{'Content-disposition':'attachment; filename='+encodedFileName,'Content-Type':'application/octet-stream'});
fileStream.pipe(res);
}
