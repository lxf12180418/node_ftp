const fs = require('fs');
const path = require('path');

// 获取文件夹大小，单位为B
function dirSize(dirPath) {
  const fileNames = fs.readdirSync(dirPath);
  let size = 0;
  fileNames.forEach(fileName => {
    const filePath = path.join(dirPath, fileName);
    if (fs.statSync(filePath).isDirectory()) {
      size += dirSize(filePath);
    } else {
      size += fs.statSync(filePath).size;
    }
  });
  return size;
}

// fullPath为文件完整路径，digit为保留小数点位数
// type表示类型，1为文件夹，2为文件
exports.getFileSize = function (type,fullPath,digit){

if( type == 1 ){
        var fileSizeBytes =  dirSize(fullPath);// 默认单位是B
}else if( type == 2){
      var fileSizeBytes = fs.statSync(fullPath).size; // 默认单位是B
}
var fileSize; //存储文件或文件夹最终大小
if(fileSizeBytes>1024 && fileSizeBytes< 1048576 ){
  fileSize = (fileSizeBytes/1024).toFixed(digit); // 输出KB
  fileSize += 'KB';
}else if(fileSizeBytes >= 1048576 && fileSizeBytes < 1073741824){
  fileSize = (fileSizeBytes/1048576).toFixed(digit); // 输出MB
  fileSize += 'MB';
}else if(fileSizeBytes >= 1073741824 && fileSizeBytes < 1099511627776){
  fileSize = (fileSizeBytes/1073741824).toFixed(digit); // 输出GB
  fileSize += 'GB';
}else if(fileSizeBytes >= 1099511627776){
  fileSize = (fileSizeBytes/1099511627776).toFixed(digit); // 输出TB
  fileSize += 'TB';
}else{
  fileSize = fileSizeBytes+'B'; // 输出B
}
  return fileSize;
}