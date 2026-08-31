param(
    [string]$IconPath = "$PSScriptRoot\..\src-tauri\icons\icon.ico",
    [string]$OutputHeaderPath = "$PSScriptRoot\..\src-tauri\nsis\header.bmp",
    [string]$OutputUnheaderPath = "$PSScriptRoot\..\src-tauri\nsis\unheader.bmp"
)

Add-Type -AssemblyName System.Drawing

Write-Host "Creating 150x57 header bitmaps with #FFFFFF background and right-aligned logo..."

# Dimensions required for standard NSIS modern UI header bitmap: 150x57 px
$bmpWidth = 150
$bmpHeight = 57

# Target logo size: 36x36 px, centered vertically and right-aligned with 12px margin
$targetSize = 36
$x = $bmpWidth - $targetSize - 12 # 102
$y = [int][Math]::Round(($bmpHeight - $targetSize) / 2) # 10 or 11

$icon = [System.Drawing.Icon]::ExtractAssociatedIcon($IconPath)
if (-not $icon) {
    # Fallback to direct load
    $icon = New-Object System.Drawing.Icon($IconPath)
}

$bmp = New-Object System.Drawing.Bitmap($bmpWidth, $bmpHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$g.DrawIcon($icon, (New-Object System.Drawing.Rectangle($x, $y, $targetSize, $targetSize)))

$g.Dispose()
$icon.Dispose()

# Save header.bmp and unheader.bmp (24-bit uncompressed BMP)
$outputDir = [System.IO.Path]::GetDirectoryName($OutputHeaderPath)
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$bmp.Save($OutputHeaderPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
$bmp.Save($OutputUnheaderPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
$bmp.Dispose()

Write-Host "Successfully generated header.bmp and unheader.bmp at $OutputHeaderPath"
