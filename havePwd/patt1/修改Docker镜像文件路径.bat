@echo off
:: 支持中文编码
chcp 65001

:: 检测是否使用管理员模式打开此脚本
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if "%errorlevel%" NEQ "0" (
    echo 请使用管理员模式打开此Bat程序
    pause
    exit
)

echo 这是一个修改Docker默认存储镜像文件目录的Bat程序
echo 建议先指定软连接后，再安装Docker
echo 因为本脚本在“C:\ProgramData\DockerDesktop”存在时清空再创建
echo 请输入存储镜像文件目录,不填默认为“D:\Docker”目录
set /p imagePath=
:: imagePath 如果为空就使用默认目录
if "%imagePath%" == "" (
    set imagePath="D:\Docker"
)

:: 先判断文件是否存在，存在就删除
if exist "C:\ProgramData\DockerDesktop" (
    if exist "C:\ProgramData\DockerDesktop\*" (
        rmdir /s /q "C:\ProgramData\DockerDesktop"
    ) else (
        del "C:\ProgramData\DockerDesktop"
    )
)

echo 当前设置的目录为 %imagePath%

:: 先判断创建的目录是否存在，存在则不创建
if not exist "%imagePath%" (
    echo 开始创建 %imagePath% 目录
    md "%imagePath%"
)

:: 创建软链接，把Docker
mklink /d "C:\ProgramData\DockerDesktop" "%imagePath%"

echo 修改成功！
pause
