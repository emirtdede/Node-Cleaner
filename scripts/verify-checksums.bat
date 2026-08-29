@echo off
setlocal enabledelayedexpansion
title Node Cleaner - SHA256 Verification Tool
color 0B

echo =========================================================
echo       NODE CLEANER - SHA256 DOSYA DOGRULAMA ARACI
echo =========================================================
echo.

if not exist "%~dp0SHA256SUMS.txt" (
    color 0C
    echo [HATA] SHA256SUMS.txt dosyasi bulunamadi!
    echo.
    pause
    exit /b 1
)

set "all_ok=1"
set "checked_count=0"

echo SHA256SUMS.txt okunuyor ve dosyalar kontrol ediliyor...
echo ---------------------------------------------------------

for /f "usebackq tokens=1,2" %%A in ("%~dp0SHA256SUMS.txt") do (
    set "expected_hash=%%A"
    set "filename=%%B"
    
    if exist "%~dp0!filename!" (
        set /a checked_count+=1
        echo [KONTROL] !filename! hesaplaniyor...
        
        for /f "skip=1 delims=" %%H in ('certutil -hashfile "%~dp0!filename!" SHA256 2^>nul') do (
            if not defined computed_hash (
                set "raw_hash=%%H"
                set "computed_hash=!raw_hash: =!"
            )
        )
        
        if /i "!computed_hash!"=="!expected_hash!" (
            echo   [OK] !filename! -^> DOGRULANDI [ORIJINAL VE GUVENLI]
        ) else (
            set "all_ok=0"
            echo   [UYARI] !filename! -^> HASH ESLESMEDI!
            echo           Beklenen : !expected_hash!
            echo           Bulunan  : !computed_hash!
        )
        set "computed_hash="
    )
)

echo ---------------------------------------------------------
if %checked_count% EQU 0 (
    color 0E
    echo [BILGI] Listelenen dosyalar bu dizinde bulunamadi.
) else if %all_ok% EQU 1 (
    color 0A
    echo.
    echo [BASARILI] Taranan tum dosyalar orijinal ve guvenli!
) else (
    color 0C
    echo.
    echo [DIKKAT] Bazi dosyalarin hash ozeti uyusmadi!
)

echo.
pause
