import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=================================================");
console.log("🛠️  NSIS Kurulum ve Kaldırma Arayüzü Yama Scripti");
console.log("=================================================\n");

// 1. NSIS binary konumunu tespit et
const possibleMakensisPaths = [
  "C:\\Users\\emir\\AppData\\Local\\tauri\\NSIS\\makensis.exe",
  "C:\\Program Files (x86)\\NSIS\\makensis.exe",
  "C:\\Program Files\\NSIS\\makensis.exe",
];

let makensisExe = null;
for (const p of possibleMakensisPaths) {
  if (fs.existsSync(p)) {
    makensisExe = p;
    break;
  }
}

if (!makensisExe) {
  console.error("❌ makensis.exe bulunamadı!");
  process.exit(1);
}
console.log(`✓ makensis.exe: ${makensisExe}`);

// 2. Header bitmap'lerinin varlığını doğrula ve gerekirse üret
const headerBmpPath = path.join(rootDir, "src-tauri", "nsis", "header.bmp");
const iconIcoPath = path.join(rootDir, "src-tauri", "icons", "icon.ico");

if (!fs.existsSync(headerBmpPath)) {
  console.log("🎨 header.bmp bulunamadı, PowerShell ile üretiliyor...");
  const genScript = path.join(rootDir, "scripts", "generate-nsis-header.ps1");
  execSync(`powershell.exe -ExecutionPolicy Bypass -File "${genScript}"`, {
    cwd: rootDir,
    stdio: "inherit",
  });
}

// 3. installer.nsi dosyasını bul
const possibleNsiPaths = [
  "C:\\Users\\emir\\AppData\\Local\\Temp\\node_cleaner_target\\release\\nsis\\x64\\installer.nsi",
  path.join(rootDir, "src-tauri", "target", "release", "nsis", "x64", "installer.nsi"),
];

let nsiPath = null;
for (const p of possibleNsiPaths) {
  if (fs.existsSync(p)) {
    nsiPath = p;
    break;
  }
}

if (!nsiPath) {
  console.error("❌ installer.nsi dosyası bulunamadı! Lütfen önce Tauri build çalıştırın.");
  process.exit(1);
}
console.log(`✓ installer.nsi: ${nsiPath}`);

// 4. installer.nsi dosyasını oku ve temiz/baştan yamala
let nsiContent = fs.readFileSync(nsiPath, "utf8");

// A. Dosyanın sonuna eklenmiş önceki fonksiyonları temizle
const desktopShortcutEnd = '!insertmacro SetLnkAppUserModelId "$DESKTOP\\${PRODUCTNAME}.lnk"';
const endIdx = nsiContent.indexOf(desktopShortcutEnd);
if (endIdx !== -1) {
  const funcEndIdx = nsiContent.indexOf("FunctionEnd", endIdx);
  if (funcEndIdx !== -1) {
    nsiContent = nsiContent.substring(0, funcEndIdx + "FunctionEnd".length);
  }
}

// B. Daha önce eklenmiş MUI2 öncesi bloğu temizle
nsiContent = nsiContent.replace(
  /; =========================================================================\r?\n; MODERN UI 2 HEADER & ICON CONFIGURATION[\s\S]*?!include MUI2\.nsh/g,
  "!include MUI2.nsh"
);

// C. Temel Değişken Tanımlarını Güncelle
nsiContent = nsiContent.replace(
  /!define UNINSTALLERICON ""/g,
  '!define UNINSTALLERICON "${INSTALLERICON}"'
);
nsiContent = nsiContent.replace(
  /!define UNINSTALLERHEADERIMAGE ""/g,
  '!define UNINSTALLERHEADERIMAGE "${HEADERIMAGE}"'
);

// D. Post-MUI2 kısmındaki duplicate MUI_ICON / MUI_HEADERIMAGE / MUI_UNICON bloklarını kaldır
const legacyIconsBlockRegex = /; Installer icon[\s\S]*?; Define registry key to store installer language/g;
const replacementIconsBlock = `; Installer sidebar image
!if "\${SIDEBARIMAGE}" != ""
  !define MUI_WELCOMEFINISHPAGE_BITMAP "\${SIDEBARIMAGE}"
  !define MUI_UNWELCOMEFINISHPAGE_BITMAP "\${SIDEBARIMAGE}"
!endif

; Define registry key to store installer language`;

if (legacyIconsBlockRegex.test(nsiContent)) {
  nsiContent = nsiContent.replace(legacyIconsBlockRegex, replacementIconsBlock);
} else {
  nsiContent = nsiContent.replace(/!define MUI_ICON "\${INSTALLERICON}"/g, "; [MOVED] !define MUI_ICON");
  nsiContent = nsiContent.replace(/!define MUI_UNICON "\${UNINSTALLERICON}"/g, "; [MOVED] !define MUI_UNICON");
  nsiContent = nsiContent.replace(/!define MUI_HEADERIMAGE/g, "; [MOVED] !define MUI_HEADERIMAGE");
  nsiContent = nsiContent.replace(/!define MUI_HEADERIMAGE_BITMAP "\${HEADERIMAGE}"/g, "; [MOVED] !define MUI_HEADERIMAGE_BITMAP");
  nsiContent = nsiContent.replace(/!define MUI_HEADERIMAGE_UNBITMAP "\${UNINSTALLERHEADERIMAGE}"/g, "; [MOVED] !define MUI_HEADERIMAGE_UNBITMAP");
}

// E. !include MUI2.nsh satırının ÖNCESİNE tanımları ve GUIINIT hook'larını ekle
const preMuiHeaderConfig = `; =========================================================================
; MODERN UI 2 HEADER & ICON CONFIGURATION (Placed strictly BEFORE MUI2.nsh)
; Forces modern_headerbmpr.exe right-aligned bitmap template and sets icons
; =========================================================================
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_RIGHT
!define MUI_HEADERIMAGE_BITMAP "${headerBmpPath}"
!define MUI_HEADERIMAGE_UNBITMAP "${headerBmpPath}"
!define MUI_ICON "${iconIcoPath}"
!define MUI_UNICON "${iconIcoPath}"
!define MUI_CUSTOMFUNCTION_GUIINIT AlignHeaderTexts
!define MUI_CUSTOMFUNCTION_UNGUIINIT un.AlignHeaderTexts
`;

nsiContent = nsiContent.replace("!include MUI2.nsh", `${preMuiHeaderConfig}\n!include MUI2.nsh`);

// F. WinAPI ile Başlık (1037) ve Alt Başlık (1038) Sol Hizalama Fonksiyonlarını Ekle
const alignFunctions = `
; =========================================================================
; WINAPI PIXEL-PERFECT HEADER TEXT ALIGNMENT (Title: 1037, Subtitle: 1038)
; Align Subtitle (1038) X position with Title (1037) X position on $HWNDPARENT
; =========================================================================
Function AlignHeaderTexts
  GetDlgItem $1 $HWNDPARENT 1037
  GetDlgItem $2 $HWNDPARENT 1038

  \${If} $1 != 0
  \${AndIf} $2 != 0
    System::Call *(i,i,i,i)p.r3
    System::Call *(i,i,i,i)p.r4
    System::Call *(i,i)p.r5

    System::Call "user32::GetWindowRect(p r1, p r3)"
    System::Call "user32::GetWindowRect(p r2, p r4)"

    ; Title rect (left:$6, top:$7, right:$8, bottom:$9)
    System::Call "*$3(i .r6, i .r7, i .r8, i .r9)"
    ; Subtitle rect (left:$R0, top:$R1, right:$R2, bottom:$R3)
    System::Call "*$4(i .r10, i .r11, i .r12, i .r13)"

    ; Convert Title top-left to client coords relative to $HWNDPARENT
    System::Call "*$5(i r6, i r7)"
    System::Call "user32::ScreenToClient(p $HWNDPARENT, p r5)"
    System::Call "*$5(i .r6, i .r7)"

    ; Convert Subtitle top-left to client coords relative to $HWNDPARENT
    System::Call "*$5(i r10, i r11)"
    System::Call "user32::ScreenToClient(p $HWNDPARENT, p r5)"
    System::Call "*$5(i .r10, i .r11)"

    ; Calculate Subtitle width ($R4) and height ($R5)
    IntOp $R4 $R2 - $R0
    IntOp $R5 $R3 - $R1

    ; Expand width by the shifted distance
    IntOp $R6 $R0 - $6
    \${If} $R6 > 0
      IntOp $R4 $R4 + $R6
    \${EndIf}

    ; Set Subtitle X position to Title X position ($6)
    ; SWP_NOZORDER (0x0004) | SWP_NOACTIVATE (0x0010) = 0x0014
    System::Call "user32::SetWindowPos(p r2, p 0, i r6, i r11, i r14, i r15, i 0x0014)"

    System::Free $3
    System::Free $4
    System::Free $5
  \${EndIf}
FunctionEnd

Function un.AlignHeaderTexts
  GetDlgItem $1 $HWNDPARENT 1037
  GetDlgItem $2 $HWNDPARENT 1038

  \${If} $1 != 0
  \${AndIf} $2 != 0
    System::Call *(i,i,i,i)p.r3
    System::Call *(i,i,i,i)p.r4
    System::Call *(i,i)p.r5

    System::Call "user32::GetWindowRect(p r1, p r3)"
    System::Call "user32::GetWindowRect(p r2, p r4)"

    System::Call "*$3(i .r6, i .r7, i .r8, i .r9)"
    System::Call "*$4(i .r10, i .r11, i .r12, i .r13)"

    System::Call "*$5(i r6, i r7)"
    System::Call "user32::ScreenToClient(p $HWNDPARENT, p r5)"
    System::Call "*$5(i .r6, i .r7)"

    System::Call "*$5(i r10, i r11)"
    System::Call "user32::ScreenToClient(p $HWNDPARENT, p r5)"
    System::Call "*$5(i .r10, i .r11)"

    IntOp $R4 $R2 - $R0
    IntOp $R5 $R3 - $R1

    IntOp $R6 $R0 - $6
    \${If} $R6 > 0
      IntOp $R4 $R4 + $R6
    \${EndIf}

    System::Call "user32::SetWindowPos(p r2, p 0, i r6, i r11, i r14, i r15, i 0x0014)"

    System::Free $3
    System::Free $4
    System::Free $5
  \${EndIf}
FunctionEnd
`;

nsiContent += `\n${alignFunctions}\n`;

// 5. Yamalanmış .nsi dosyasını diske kaydet
fs.writeFileSync(nsiPath, nsiContent, "utf8");
console.log("✓ installer.nsi başarıyla yamalandı!");

// 6. makensis.exe ile yeniden derle
console.log("\n⚙️  makensis.exe ile yeniden derleniyor...");
const nsiDir = path.dirname(nsiPath);

try {
  const makensisCmd = `"${makensisExe}" "${nsiPath}"`;
  execSync(makensisCmd, {
    cwd: nsiDir,
    stdio: "inherit",
  });
  console.log("\n✅ NSIS Installer başarıyla yeniden derlendi!");
} catch (err) {
  console.error("❌ makensis.exe derleme hatası:", err);
  process.exit(1);
}

// 7. Üretilen nsis-output.exe dosyasını bundle/nsis dizinine aktar
const nsisOutputDir = path.dirname(nsiPath);
const generatedOutput = path.join(nsisOutputDir, "nsis-output.exe");
const targetBundleNsis = path.join(
  path.resolve(nsisOutputDir, "..", ".."),
  "bundle",
  "nsis",
  "Node Cleaner_1.0.0_x64-setup.exe"
);

if (fs.existsSync(generatedOutput)) {
  fs.mkdirSync(path.dirname(targetBundleNsis), { recursive: true });
  fs.copyFileSync(generatedOutput, targetBundleNsis);
  console.log(`✓ Güncellenmiş Setup dosyası aktarıldı: ${targetBundleNsis}`);
}
