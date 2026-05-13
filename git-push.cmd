@echo off
setlocal
REM 推送到 GitHub：用 subst 映射到 V:，避免用户目录含英文撇号时部分终端里 git 路径异常
set "REPO=%~dp0"
if "%REPO:~-1%"=="\" set "REPO=%REPO:~0,-1%"
set "DRV=V:"

subst %DRV% "%REPO%" >nul 2>&1
if errorlevel 1 (
  echo [git-push] subst 失败。若 V: 已被占用，请先执行: subst %DRV% /d
  pause
  exit /b 1
)

pushd %DRV%\
echo [git-push] 目录: %REPO%
echo.
git push
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
exit /b 0
