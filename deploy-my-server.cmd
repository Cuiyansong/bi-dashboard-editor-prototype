@echo off
setlocal EnableExtensions
REM =============================================================================
REM 一键：npm build + scp 上传到云服务器
REM 依赖：本机已装 OpenSSH（Windows 可选功能）、SSH 里已配置 Host my_server
REM       例：在 %USERPROFILE%\.ssh\config 中：
REM         Host my_server
REM           HostName 你的公网IP或域名
REM           User root
REM           IdentityFile ~/.ssh/id_ed25519
REM =============================================================================

REM 远程目录（Linux 上 Nginx root 指向这里；无 root 时可改成 /home/ubuntu/bi-dashboard）
set "REMOTE=my_server"
set "REMOTE_DIR=/var/www/bi-dashboard"

REM 若站点挂在子路径（如 http://ip/bi/），取消下一行注释并改成你的路径（须以 / 结尾）
REM set "VITE_BASE=/bi/"

set "REPO=%~dp0"
if "%REPO:~-1%"=="\" set "REPO=%REPO:~0,-1%"
set "DRV=W:"

subst %DRV% "%REPO%" >nul 2>&1
if errorlevel 1 (
  echo [deploy] subst 失败。若 %DRV% 占用: subst %DRV% /d
  pause
  exit /b 1
)

pushd %DRV%\
echo [deploy] 构建...
call npm.cmd run build
if errorlevel 1 (
  echo [deploy] build 失败
  popd & subst %DRV% /d >nul 2>&1
  pause
  exit /b 1
)

echo [deploy] 确保远程目录存在...
ssh %REMOTE% "mkdir -p %REMOTE_DIR%"

echo [deploy] 上传 dist 到 %REMOTE%:%REMOTE_DIR% ...
scp -r dist\. "%REMOTE%:%REMOTE_DIR%/"
if errorlevel 1 (
  echo [deploy] scp 失败（检查 SSH、防火墙、REMOTE_DIR 权限）
  popd & subst %DRV% /d >nul 2>&1
  pause
  exit /b 1
)

popd
subst %DRV% /d >nul 2>&1
echo [deploy] 完成。请在服务器上配置 Nginx/Apache 指向 %REMOTE_DIR%，并重载服务。
exit /b 0
