Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path "$scriptDir\.."
$iconPath = "$rootDir\src-tauri\icons\icon.png"
$headerOutPath = "$rootDir\src-tauri\nsis\header.bmp"
$unheaderOutPath = "$rootDir\src-tauri\nsis\unheader.bmp"

Write-Host "Creating 150x57 header bitmaps with #FFFFFF background and right-aligned logo..."

$bmp = New-Object System.Drawing.Bitmap 150, 57, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$icon = [System.Drawing.Image]::FromFile($iconPath)
$targetSize = 34
$x = 150 - $targetSize - 16
$y = [Math]::Round((57 - $targetSize) / 2)

$g.DrawImage($icon, $x, $y, $targetSize, $targetSize)
$icon.Dispose()
$g.Dispose()

$bmp.Save($headerOutPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
$bmp.Save($unheaderOutPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
$bmp.Dispose()

Write-Host "Successfully generated header.bmp and unheader.bmp at $headerOutPath"
