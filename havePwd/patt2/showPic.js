/*
本模块是根据图片路径读取图片转码成Base64编码并输出img元素的
食用方法：
1、引入该模块
const showPic = require('./showPic'); （单引号为该js模块路径）
2、使用方法获取图片的html，返回值为字符串类型的图片html
showPic.getPic(图片路径);
*/
const fs = require('fs');

// 获取图片Base64编码
exports.getPic = function(filePath) {
  try{
    // 需等待图片数据读取完毕所以使用同步读文件内容
    const data = fs.readFileSync(filePath, 'binary');
    // 创建HTML图片
    const img = '<img src="'+binToBase64(data)+'"/>'
    return img;
  } catch(err){	
    console.log(err.stack);
  }
}

const binToBase64 = function(data) {
  const picBuffer = Buffer.from(data, 'binary');
// base64编码加上“data:image/jpeg;base64,”便是指Base64图片啦，赋值给img元素的src属性即可展示该图片  
return 'data:image/jpeg;base64,'+picBuffer.toString('base64');
}