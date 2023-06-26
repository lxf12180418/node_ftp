chcp 65001
@echo off
rem 使用默认浏览器打开http://127.0.0.1
start iexplore.exe 127.0.0.1
echo 使用默认浏览器访问首页：http://127.0.0.1成功
echo 如果显示失败请刷新页面或在该页面敲回车，尽量别用IE浏览器，关闭该窗口即可终止服务！
node ./show.js
pause
