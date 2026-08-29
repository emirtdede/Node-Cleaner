import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const releaseOutputDir = path.join(rootDir, "release_output");

console.log("=================================================");
console.log("🚀 Node Cleaner - Tek Tıkla Release & Hash Üretici");
console.log("=================================================\n");

// 1. Sürüm Senkronizasyonunu Doğrula
console.log("📦 1. Sürüm senkronizasyonu kontrol ediliyor...");
try {
  execSync("npm run check-version", { cwd: rootDir, stdio: "inherit" });
} catch (err) {
  console.error("❌ Sürüm senkronizasyonu başarısız oldu!");
  process.exit(1);
}

// 2. Tauri Release Derlemesi
console.log("\n🔨 2. Tauri Release derlemesi başlatılıyor (Optimized x64)...");
try {
  execSync("npm run tauri build", { cwd: rootDir, stdio: "inherit" });
} catch (err) {
  console.error("❌ Derleme işlemi başarısız oldu!");
  process.exit(1);
}

// 3. Çıktı Klasörünü Hazırla
if (!fs.existsSync(releaseOutputDir)) {
  fs.mkdirSync(releaseOutputDir, { recursive: true });
}

// Eğer arka planda çalışan eski portable veya test örneği varsa kapat
try {
  execSync("taskkill /F /IM node-cleaner.exe /IM Node-Cleaner-1.0.0-Portable.exe 2>nul", { stdio: "ignore" });
} catch {}

// 4. Target dizinlerini tara ve dosyaları kopyala
console.log("\n📂 3. Derlenen binary paketleri release_output klasörüne kopyalanıyor...");

const possibleTargetDirs = [
  "C:\\Users\\emir\\AppData\\Local\\Temp\\node_cleaner_target\\release",
  path.join(rootDir, "src-tauri", "target", "release"),
];

let targetDir = null;
for (const dir of possibleTargetDirs) {
  if (fs.existsSync(path.join(dir, "node-cleaner.exe"))) {
    targetDir = dir;
    break;
  }
}

if (!targetDir) {
  console.error("❌ Derleme çıktısı (node-cleaner.exe) bulunamadı!");
  process.exit(1);
}

const artifacts = [
  {
    src: path.join(targetDir, "node-cleaner.exe"),
    destName: "Node-Cleaner-1.0.0-Portable.exe",
  },
  {
    src: path.join(targetDir, "bundle", "nsis", "Node Cleaner_1.0.0_x64-setup.exe"),
    destName: "Node-Cleaner-1.0.0-x64-Setup.exe",
  },
  {
    src: path.join(targetDir, "bundle", "msi", "Node Cleaner_1.0.0_x64_tr-TR.msi"),
    destName: "Node-Cleaner-1.0.0-x64.msi",
  },
];

for (const art of artifacts) {
  if (fs.existsSync(art.src)) {
    const destPath = path.join(releaseOutputDir, art.destName);
    let copied = false;
    for (let retry = 0; retry < 3; retry++) {
      try {
        fs.copyFileSync(art.src, destPath);
        copied = true;
        break;
      } catch {
        // Retry delay
        execSync("taskkill /F /IM node-cleaner.exe /IM Node-Cleaner-1.0.0-Portable.exe 2>nul", { stdio: "ignore" });
      }
    }
    if (copied) {
      const sizeMb = (fs.statSync(destPath).size / (1024 * 1024)).toFixed(2);
      console.log(`  ✓ Kopyalandı: ${art.destName} (${sizeMb} MB)`);
    } else {
      console.error(`  ❌ Kopyalanamadı (dosya kilitli olabilir): ${art.destName}`);
    }
  } else {
    console.warn(`  ⚠️ Kaynak dosya bulunamadı: ${art.src}`);
  }
}

// verify-checksums.bat dosyasını release_output içerisine kopyala
const verifyScript = path.join(rootDir, "scripts", "verify-checksums.bat");
if (fs.existsSync(verifyScript)) {
  fs.copyFileSync(verifyScript, path.join(releaseOutputDir, "verify-checksums.bat"));
  console.log(`  ✓ Kopyalandı: verify-checksums.bat`);
}

// 5. SHA-256 Hash'lerini Otomatik Hesapla ve SHA256SUMS.txt Yaz
console.log("\n🔐 4. SHA-256 hash özetleri hesaplanıyor...");
const validFiles = [
  "Node-Cleaner-1.0.0-Portable.exe",
  "Node-Cleaner-1.0.0-x64-Setup.exe",
  "Node-Cleaner-1.0.0-x64.msi",
];

const checksumLines = [];

for (const fileName of validFiles) {
  const filePath = path.join(releaseOutputDir, fileName);
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex").toUpperCase();
    checksumLines.push(`${hash}  ${fileName}`);
    console.log(`  🔑 ${fileName} -> ${hash}`);
  }
}

const sumsFilePath = path.join(releaseOutputDir, "SHA256SUMS.txt");
fs.writeFileSync(sumsFilePath, checksumLines.join("\n") + "\n", "utf8");
console.log(`\n✅ ${sumsFilePath} başarıyla güncellendi!`);

console.log("\n=================================================");
console.log("🎉 RELEASE DERLEMESİ VE DOĞRULAMA TAMAMLANDI!");
console.log(`📁 Çıktı Klasörü: ${releaseOutputDir}`);
console.log("=================================================\n");
