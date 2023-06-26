var data = {}; // 定义data对象接收show.js发送过来的json对象
var selectLink = ''; // 接收需要查询的路径，初始为空即查询show.js所在目录下的
var defaultPath = ''; // 展示索引的默认目录

// 向show.js发送get请求
function getInfor(){
var dir =   document.getElementById("1");
var file = document.getElementById("2");
var title = document.getElementsByTagName("h1")[0];
$.ajax({
       type:'GET',
       url:'./getDatas',
       data:{link:selectLink,user:user,pwd:pwd},
       dataType:'json',
       async:'true',
       success:function(datas){
// 将从服务器端获取的js对象传给data对象
data = datas;
for (let key in datas) {
if( key == "error" ){
   alert("出现错误："+datas[key]);
   location.reload(true); // 强制刷新
  return ;
}
if(key == "nowDir"){
// 设置body大标题
 title.innerText = datas[key]+'\的索引';
if( selectLink =="" ){
   defaultPath = datas[key];
}
if(document.querySelector('h1').innerText.replace('\的索引','') != defaultPath){
$('hr').after('<a href="javascript:void(0)" onclick="setBeforeDir()">上级目录</a>');
$('hr').after('<img src="./public/src/previousDir.png">');
}
}else if( key == "dirs"){
    console.log(datas[key]);
     for( let v in datas[key] ){
       add(v,datas[key][v],dir);
}
}else if( key == "files"){
    for( let v in datas[key] ){
       add(v,datas[key][v],file);
}
}
}
},
   error:function(err){
            alert('请求服务器接口出现问题，目录、文件内容等无法正常显示！');
            console.log('出现以下问题：');
            console.log(err);
}
});
}

// 给html文档添加文件夹和文件的超链接
function add(name,infor,object){
// 文件夹和文件分开处理
$(object).after('<br/>');
// 存储大小以及修改时间的文本节点;
$(object).after(document.createTextNode('   '+infor[1]+'     '+infor[2])); 
$(object).after('<a href="javascript:void(0)" target="_self" onclick="getLink(this)">'+name+'</a>'); 
// 将链接添加到file元素的最后面
if(document.getElementById("1") == object){
// &nbsp; 为空格的HTML实体编码，能产生空格
// ./为当前目录是加载Index.html所在的目录，并非是cope.js文件所在目录
$(object).after('<img src="./public/src/dir.png"/>');
}else{
$(object).after('<img src="./public/src/file.png"/>');
}
}

//分文件和文件夹，文件夹读取内部文件和文件夹，文件读取数据
function getLink(element){
for (let key in data) {
if( key == "dirs"){
     for( let v in data[key] ){
       if( v == element.innerText ){
           selectLink = data[key][v][0];
           // alert("获取目录内容："+selectLink);
           removeTextNodes(document.body); // 删除所有文本节点
           // 把原来添加的超链接元素删除，即删除a、br和img元素即可
           del(['a','br','img']);
           getInfor();
           return ;
}}}else if(key == "files"){
      for( let v in data[key] ){
       if( v == element.innerText ){
           selectLink = data[key][v][0];
           // alert("即将获取文件内容："+selectLink);
           $.ajax({
            url:'./content',
            type:'GET',
            data:{link:selectLink,user:user,pwd:pwd},
            dataType:'text',
            success:function(data){
             if ( data.indexOf('img:') == 0 ){
              // 打开一个新窗口并写入数据
            var newWindow = window.open();
             // 展示图片，数据以img:开头说明是图片，通过replace把“img:”替换成空
           newWindow.document.write(data.replace('img:',''));
}else if( data.indexOf('text:') == 0 ){
            // 展示文本内容
             // 创建文本节点，把数据写入文本节点中，保证不会加载外部图片、视频等资源以及html、js等内容
            // 打开一个新窗口并写入数据
            var newWindow = window.open();
            var textNode = document.createTextNode(data.replace('text:',''));
            newWindow.document.body.appendChild(textNode);
}else if(data.indexOf('msg:') == 0){
// 请求文件提示信息(错误信息)
       alert(data.replace('msg:',''));
}else{
   // 请求视频等其他格式文件打开返回链接的新页面
   var newWindow = window.open(data,'_blank'); 
}
},
              error:function(err){
              alert('打开文件出现一些未知的问题！错误内容在控制台输出！');
              console.log(err);
}
});
           return ;
}}}
}
}

// 删除指定某个元素(所有)，element为需要删除所有元素的数组
function del(element){
for( var i in element){
var elements = document.getElementsByTagName(element[i]); // 获取所有的element元素
while (elements.length > 0) { 
  elements[0].parentNode.removeChild(elements[0]); // 对于每个元素，从其父节点中移除元素
}
}
}

// 点击上级目录时设置访问目录为上级目录
function setBeforeDir(){
   selectLink =  getBeforeDir(document.querySelector('h1').innerText.replace('的索引',''));
   removeTextNodes(document.body); // 删除所有文本节点
   del(['a','br','img']); // 删除所有a、br、img元素
   getInfor();
}

// 获取当前目录的上一个目录
function getBeforeDir(str){
// str为当前目录路径
var reversedStr = "";
var b = [];
// 先对str进行倒序输出到reversedStr
for (var i = str.length - 1; i >= 0; i--) {
  reversedStr += str[i];
}
// 获取reversedStr中首次出现\前的数据存储到b数组
for (var i = 0; i < reversedStr.length; i++) {
   if(reversedStr[i] != '/'){
     b[i] = reversedStr[i];
     continue;
}
     break;
}
// 将b数组的数据再倒序成正常目录名称
reversedStr = '';
for (var i = b.length - 1; i >= 0; i--) {
  reversedStr += b[i];
}
// 将原来目录去掉“\最后一个目录名称”，即为上一个目录

return str.replace('/'+reversedStr,'');
}

// 遍历整个文档树，删除文本节点

function removeTextNodes(node) {
  if (node.nodeType === Node.TEXT_NODE) { // 如果当前节点是文本节点
    const parent = node.parentNode;
    if (parent && parent.nodeName === "H2") { // 如果该文本节点在 h2 元素中，则跳过
      return; // 则跳过删除
    }
    parent.removeChild(node); // 否则将其从 DOM 中移除
  } else { // 如果当前节点不是文本节点，则递归遍历其子节点
    const childNodes = node.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      removeTextNodes(childNodes[i]);
    }
  }
}