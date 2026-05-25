@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM 一键：暂存改动 -> 提交 -> 推送到 GitHub（main）
REM 用法：
REM   双击运行，按提示输入提交说明
REM   或在命令行：upload-github.cmd "fix: 修改说明"
REM
REM 说明：通过 subst 映射到 V:，避免用户目录含英文撇号时 git 路径异常

set "REPO=%~dp0"
if "%REPO:~-1%"=="\" set "REPO=%REPO:~0,-1%"
set "DRV=V:"
set "REMOTE=origin"
set "BRANCH=main"

subst %DRV% /d >nul 2>&1
subst %DRV% "%REPO%" >nul 2>&1
if errorlevel 1 (
  echo [upload-github] subst 失败。若 %DRV% 已被占用，请先执行: subst %DRV% /d
  pause
  exit /b 1
)

pushd %DRV%\

echo ========================================
echo   上传到 GitHub
echo   仓库: %REPO%
echo   分支: %BRANCH%
echo ========================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [upload-github] 当前目录不是 Git 仓库。
  goto :fail
)

set "MSG=%~1"
if not defined MSG (
  set /p "MSG=请输入提交说明（直接回车使用默认）: "
)
if not defined MSG set "MSG=chore: sync local changes"

echo.
echo [1/4] 检查状态...
git status -sb
echo.

echo [2/4] 暂存所有改动...
git add -A
if errorlevel 1 goto :fail

git diff --cached --quiet
if errorlevel 1 (
  echo [3/4] 提交: %MSG%
  git commit -m "%MSG%"
  if errorlevel 1 goto :fail
) else (
  echo [3/4] 没有新的改动需要提交，将只推送已有本地提交...
)

echo.
echo [4/4] 推送到 %REMOTE%/%BRANCH% ...
git push -u %REMOTE% %BRANCH%
set "ERR=!ERRORLEVEL!"

if not "!ERR!"=="0" (
  echo.
  echo [upload-github] 推送失败，10 秒后自动重试一次...
  timeout /t 10 /nobreak >nul
  git push -u %REMOTE% %BRANCH%
  set "ERR=!ERRORLEVEL!"
)

popd
subst %DRV% /d >nul 2>&1

echo.
if not "!ERR!"=="0" (
  echo [upload-github] 失败，退出码 !ERR!
  echo 请检查网络、GitHub 登录（HTTPS 凭据或 SSH）后重试。
  pause
  exit /b !ERR!
)

echo [upload-github] 完成。
echo 远程: https://github.com/sansuny/bi-dashboard-editor-prototype
pause
exit /b 0

:fail
set "ERR=%ERRORLEVEL%"
if "%ERR%"=="" set "ERR=1"
popd 2>nul
subst %DRV% /d >nul 2>&1
echo.
echo [upload-github] 失败，退出码 %ERR%
pause
exit /b %ERR%
