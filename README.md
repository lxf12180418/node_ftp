# Node实现仿FTP索引网站

这是一个仿FTP站点的全栈网站，前端为Html+CSS+JS+Jquery，后端为Node.js编写。

有密码访问的默认账号和密码都是test！！！

修改展示目录、账号和密码都在show.js文件中修改！！！

## PC端使用

noPwd目录下的为无需密码验证即可访问的FTP站点。

havePwd目录下的为需要密码验证才能访问的FTP站点。havePwd中有两种实现密码验证的方式，一种是每次请求都进行验证，一种是初次访问验证一次，其他请求不再进行验证。

needShow目录默认为展示目录，即默认展示其中的内容！！！

PC端点击一键运行.bat即可启动项目，前提是安装过Node和其他模块和框架。

部署环境：Node.js16版本以上应该都行，且提前安装express框架、fs、util、url、path模块。

安装方式：npm install -g 模块名

电脑上安装好node，可以点击一键运行.bat来运行程序，使用默认浏览器打开(如果是IE浏览器，建议更换浏览器打开)。默认打开路径为http://127.0.0.1，即通过80端口访问。如果更换端口请使用http://127.0.0.1:端口号来访问！关闭该cmd程序即可关闭WEB服务！

## 移动端使用

移动端具体使用部署步骤中有说明！需要安装d_node.apk，为了保持APP的后台运行，记得取消对该应用进行电池优化并且运行其后台运行！！！

移动端默认通过8080端口访问！！！

## Docker部署

首先安装Docker

把项目文件(根目录有Dockerfile文件)通过下面两个命令来创建镜像文件并运行在Docker容器中！

docker build -t my-web-service  

docker run 8000(外部访问的端口):8080 (要暴露的Docker容器端口)  my-web-service

然后本机通过http://127.0.0.1:8000(或http://localhost:8000)来访问Web服务啦！

互联网通过http://本机外网IP:8000来访问！