@echo off
chcp 65001 >nul
setlocal
REM 仅推送已有提交（不 add/commit）。一键上传请双击 upload-github.cmd
set "REPO=%~dp0"
if "%REPO:~-1%"=="\" set "REPO=%REPO:~0,-1%"
set "DRV=V:"

subst %DRV% /d >nul 2>&1
subst %DRV% "%REPO%" >nul 2>&1
if errorlevel 1 (
  echo [git-push] subst 失败。若 V: 已被占用，请先执行: subst V: /d
  pause
  exit /b 1
)

pushd %DRV%\
echo [git-push] 仅推送 origin/main ...
git push -u origin main
set ERR=%ERRORLEVEL%
popd
subst %DRV% /d >nul 2>&1

echo.
if %ERR% neq 0 (
  echo [git-push] 失败，退出码 %ERR%
  pause
  exit /b %ERR%
)
echo [git-push] 完成。
pause
exit /b 0
