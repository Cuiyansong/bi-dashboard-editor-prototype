@echo off
cd /d "%~dp0"
git status
echo ---
git diff --stat
echo ---
git log -5 --oneline
echo ---
git add -A
git status
git commit -m "feat: cohort/product analysis templates, home layout, preview thumbnails" -m "Replace legacy customer/product presets with self-service query layouts; product mode without tier column; home grid and previewWidgets for thumbnails; misc UI copy."
git push origin HEAD
echo exit=%errorlevel%
