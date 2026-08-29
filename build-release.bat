@echo off
title Node Cleaner - One-Click Release Builder
color 0A

echo =========================================================
echo       NODE CLEANER - TEK TIKLA RELEASE VE HASH URETICI
echo =========================================================
echo.

node scripts/build-release.js

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo [HATA] Derleme veya hash islemi sirasinda bir hata olustu!
    echo.
) else (
    echo.
    echo [BASARILI] Tum release paketleri ve SHA256SUMS.txt hazirlandi!
    echo.
)

pause
