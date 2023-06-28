# 使用基础镜像
FROM ubuntu:latest

# 设置作者信息
LABEL maintainer="2022212787@qq.com"

# 设置工作目录
WORKDIR /app

# 复制项目文件到镜像中
COPY !(一键运行.bat) /app

# 安装Node.js
RUN apt-get update && apt-get install -y nodejs-legacy

# 安装需要的模块和框架，最好后面跟上版本号如express@版本号
# 来确保每次部署安装的都是同一个版本
RUN npm install express util url fs path

# 暴露端口
# 如果修改了show.js中端口号记得把8080改成对应的端口号！！！
EXPOSE 8080

# 运行Web服务
CMD ["node","show.js"]




