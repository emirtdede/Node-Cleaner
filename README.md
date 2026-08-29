<div align="center">

# 🧹 Node Cleaner - Modern & Fast Desktop Application

</div>

---

<div align="center">

[![](https://img.shields.io/badge/Language-English-blue?style=for-the-badge&logo=google-translate)](#english-version)
&nbsp;&nbsp;&nbsp;&nbsp;
[![](https://img.shields.io/badge/Dil-T%C3%BCrk%C3%A7e-red?style=for-the-badge&logo=google-translate)](#turkish-version)

</div>

---

<div align="center">

![Tauri](https://img.shields.io/badge/Tauri-v2.0-FFC131?style=for-the-badge&logo=tauri&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-2021-DEA584?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-4338CA?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</div>

---

<a id="english-version"></a>
# English Version

<div align="center">
  <img src="assets/brand/app-icon.svg" alt="Node Cleaner Logo" width="130" height="130" />
  <h3>Node Cleaner - Next-Gen Desktop Storage Cleaner</h3>
  <p><em>Ultra-Fast Discovery, Safe Deletion & Monorepo-Aware Cleanup for JavaScript / TypeScript Projects</em></p>
</div>

<br>

## 💻 Project Overview

**Node Cleaner** is a high-performance, enterprise-grade desktop utility designed specifically for modern web developers, software engineers, and digital studios. Powered by **Tauri v2** and **Rust** with a sleek **React 19 & TypeScript** user interface, Node Cleaner rapidly discovers forgotten, space-consuming `node_modules` folders across multiple hard drives and workspaces, computes exact folder sizes in parallel, and safely deletes them to reclaim gigabytes of disk space.

Operating with millisecond-speed filesystem traversal, non-blocking asynchronous measurements, and strict safety guards (`SEC-DEL`), Node Cleaner ensures that critical system directories, codebases, and source files remain completely untouched and protected.

---

## 🚀 Key Features

- **⚡ Blazing-Fast Discovery Engine**: Traverses directory trees while instantly skipping sub-directory recursion inside `node_modules`, discovering hundreds of projects in mere seconds without system stutter.
- **🛡️ Enterprise Safety Guard (`SEC-DEL`)**: Multi-layered path verification preventing accidental deletion of system roots (`C:\`), OS directories (`Windows`, `Program Files`), user profile roots, or non-`node_modules` folders.
- **📦 Monorepo & Workspace Hierarchy Detection**: Intelligently groups nested package folders under their respective monorepo roots (`pnpm-workspace`, `Turbo`, `Lerna`, `Nx`, `Yarn Workspaces`, `Bun`).
- **🎛️ Two-Stage Safe Deletion**: Supports both reversible **Recycle Bin** soft deletion (`SHFileOperationW` integration) and lightning-fast **Permanent** deletion with confirmation modals.
- **📊 60 FPS Virtualized Table**: TanStack Virtualizer ensures buttery-smooth 60 FPS scrolling and rendering even across 10,000+ discovered project entries with zero DOM bloat.
- **🌐 73 Languages Localization (i18n)**: 100% full translation coverage across 73 independent regional languages with instant in-app switching and zero reload time.
- **🎨 Modern Glassmorphism & Theme Engine**: Curated aesthetic dark and light colorways (Dark Classic, Emerald, Cyberpunk, AMOLED Black, Clean Light, Velvet Purple) with custom frameless window controls.
- **🔍 Real-Time Filtering & Sorting**: Instant search across project names and filesystem paths, sort by largest size, oldest last-modified dates, or package manager (`npm`, `pnpm`, `yarn`, `bun`).
- **⌨️ Keyboard & A11y Shortcuts**: Navigate rows with `ArrowUp` / `ArrowDown`, toggle selection with `Space`, select all visible with `Ctrl+A`, and clear with `Escape`.
- **🔐 Automatic Checksum & Release Verification**: Integrated single-click build system producing signed Setup (.exe), MSI, and Portable binaries with auto-generated SHA-256 signatures.

---

## 🛠️ Tech Stack

<div align="center">

![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=tauri&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-DEA584?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4338CA?style=for-the-badge)

</div>

- **Desktop Framework**: Tauri v2.0 (Native WebView2 integration & low memory footprint)
- **Core Backend**: Rust 2021 (Tokio async runtime, `walkdir`, `trash`, Windows Win32 Shell API)
- **Frontend Framework**: React 19.0 & TypeScript 5.7
- **Build Tool**: Vite 6.4 with modular Rollup chunk splitting (`vendor-core`, `vendor-ui`, `locales-bundle`)
- **State Management**: Zustand 5.0 (Atomic scan, selection, UI and preferences stores)
- **Virtualization & UI**: `@tanstack/react-virtual` 3.13, `lucide-react` & CSS Custom Properties Design System
- **Testing**: Vitest 3.2 (Frontend) & Rust Built-in Test Suite (`cargo test`)

---

## 📁 Project Structure

```tree
node_cleaner/
├── assets/                         # Vector brand assets & logo
│   └── brand/
│       ├── app-icon.svg
│       └── logo-master.svg
├── scripts/                        # Automated release build & verification tools
│   ├── build-release.js            # One-click release builder & SHA-256 generator
│   ├── check-version.js            # Triple-tier version synchronization validator
│   └── verify-checksums.bat        # Windows double-click cryptographic verify script
├── src/                            # Frontend Application (React 19 + TypeScript)
│   ├── app/                        # App shell, routing & bootstrapping
│   ├── components/                 # Primitives, brand, layout & window controls
│   │   ├── brand/                  # Logo & typography
│   │   ├── common/                 # ErrorBoundary & global dialogs
│   │   ├── layout/                 # Custom frameless WindowControls
│   │   └── primitives/             # GlassSurface, Button, Checkbox, Toast, etc.
│   ├── features/                   # Feature modules
│   │   ├── deletion/               # Recycle Bin & Permanent confirmation dialogs
│   │   ├── results/                # Virtualized table, project rows & action bar
│   │   ├── scan/                   # ScanHeader, ScanHero, controller & helpers
│   │   └── settings/               # SettingsPanel, themes, favorites & language search
│   ├── lib/                        # Tauri IPC wrapper & formatters
│   ├── locales/                    # 73 Independent Locale Modules
│   │   ├── langs/                  # Individual language files (en.ts, tr.ts, de.ts...)
│   │   ├── dictionaries.ts         # Central translation assembler
│   │   ├── languages.ts            # Language metadata list
│   │   └── types.ts                # TypeScript strict translation schema
│   ├── stores/                     # Zustand state management stores
│   └── styles/                     # Pure CSS theme tokens & glassmorphism variables
├── src-tauri/                      # Rust Desktop Backend
│   ├── capabilities/               # Tauri v2 security capabilities
│   ├── src/
│   │   ├── commands/               # Tauri IPC command handlers (Scan, Delete, Settings)
│   │   ├── deletion/               # Coordinator, Recycle Bin, Permanent & SEC-DEL Guard
│   │   ├── error/                  # Type-safe AppError & DTO mappings
│   │   ├── platform/               # Windows Shell & known folder resolvers
│   │   ├── scanner/                # Discovery, Size Measurement & Cancellation tokens
│   │   ├── settings/               # Atomic configuration repository
│   │   ├── lib.rs                  # Application initialization & plugins
│   │   └── main.rs                 # Native binary entrypoint
│   ├── Cargo.toml                  # Rust dependencies & optimized release profile
│   └── tauri.conf.json             # Tauri window, security & bundle metadata
├── package.json                    # Node dependencies & project scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite & Rollup chunking configuration
└── README.md                       # Documentation
```

---

## 🛡️ Security & Architecture (SEC-DEL Guard)

| Layer | Component | Security / Performance Guarantee |
| :--- | :--- | :--- |
| **Safety Guard** | `guard.rs` | Enforces exact `node_modules` folder naming, depth $\ge 3$, blocks root drives and system dirs. |
| **Discovery** | `discovery.rs` | Uses `WalkDir` with `skip_current_dir()` on candidates to prevent scanning inner files during discovery. |
| **Measurement** | `size.rs` | Tokio async workers with bounded semaphore `(CPU / 2).clamp(2, 4)` avoiding disk queue starvation. |
| **Recycle Bin** | `recycle_bin.rs` | Native `SHFileOperationW` integration allowing instantaneous Ctrl+Z recovery from Windows Recycle Bin. |
| **Persistence** | `repository.rs` | Atomic `.tmp` write followed by atomic rename protecting settings against corruption on power loss. |

---

## ⚙️ Installation & Usage

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [Rust & Cargo](https://www.rust-lang.org/tools/install) (latest stable toolchain)
- Windows 10 / 11 (64-bit) with WebView2 runtime installed

### Step-by-Step Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/emirtdede/Node-Cleaner.git
   cd Node-Cleaner
   ```

2. **Install Node Dependencies:**
   ```bash
   npm install
   ```

3. **Run Automated Test Suite:**
   ```bash
   npm test
   cargo test --manifest-path src-tauri/Cargo.toml
   ```

4. **Verify TypeScript & Linting:**
   ```bash
   npx tsc --noEmit
   ```

5. **Run Locally in Development Mode:**
   ```bash
   npm run tauri dev
   ```

6. **Build Production Release Bundles (Setup, MSI, Portable):**
   ```bash
   npm run build:release
   ```
   *Compiled installer packages, portable executable, and cryptographic SHA-256 signatures will be output to:* `release_output/`

---

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<br>

---

<a id="turkish-version"></a>
# Türkçe Versiyon

<div align="center">
  <img src="assets/brand/app-icon.svg" alt="Node Cleaner Logo" width="130" height="130" />
  <h3>Node Cleaner - Yeni Nesil Masaüstü Disk Temizleme Uygulaması</h3>
  <p><em>JavaScript ve TypeScript Projeleri İçin Ultra Hızlı Keşif, Güvenli Silme ve Monorepo Uyumlu Temizlik</em></p>
</div>

<br>

## 💻 Project Overview (Proje Genel Bakışı)

**Node Cleaner**, modern web geliştiricileri, yazılım mühendisleri ve dijital stüdyolar için özel olarak geliştirilmiş yüksek performanslı bir masaüstü uygulamasıdır. **Tauri v2** ve **Rust** motorunun gücüyle **React 19 & TypeScript** arayüzünü birleştiren Node Cleaner; disklerinizde unutulmuş, onlarca gigabayt yer kaplayan `node_modules` klasörlerini saniyeler içinde tespit eder, klasör boyutlarını paralel olarak hesaplar ve güvenle silerek disk alanınızı geri kazandırır.

Milisaniye hızında dosya sistemi taraması, asenkron ölçüm iş parçacıkları ve sıkı güvenlik bariyerleri (`SEC-DEL`) ile donatılan Node Cleaner; işletim sistemi dosyalarına, kaynak kodlarınıza ve kritik dizinlerinize asla zarar vermez.

---

## 🚀 Key Features (Önemli Özellikler)

- **⚡ Ultra Hızlı Keşif Motoru**: Dizin ağaçlarını tararken `node_modules` klasörünün içine girmeden atlar; sistemde donma yaratmadan yüzlerce projeyi saniyeler içinde keşfeder.
- **🛡️ Kurumsal Güvenlik Bariyeri (`SEC-DEL`)**: Kök dizin (`C:\`), işletim sistemi klasörleri (`Windows`, `Program Files`), kullanıcı profil kökü ve `node_modules` dışındaki klasörlerin silinmesini kesin olarak engelleyen çok katmanlı yol doğrulaması.
- **📦 Monorepo ve Çalışma Alanı Tespiti**: İç içe geçmiş paket klasörlerini otomatik olarak ana monorepo kökü altında (`pnpm-workspace`, `Turbo`, `Lerna`, `Nx`, `Yarn Workspaces`, `Bun`) gruplar.
- **🎛️ İki Aşamalı Güvenli Silme**: Hem Windows Geri Dönüşüm Kutusu üzerinden geri alınabilir silme (`SHFileOperationW`) hem de anında kalıcı silme desteği.
- **📊 60 FPS Sanallaştırılmış Tablo**: TanStack Virtualizer sayesinde 10.000+ proje satırında bile DOM yükü oluşturmadan yağ gibi kayan 60 FPS akıcılık.
- **🌐 73 Dil Desteği (i18n)**: 73 bağımsız bölgesel dilde %100 tam çeviri kapsamı; uygulama yeniden başlatılmadan anında dil değişimi.
- **🎨 Modern Glassmorphism ve Tema Motoru**: Özel çerçevesiz pencere kontrolleri ile donatılmış estetik koyu ve açık renk temaları (Klasik Koyu, Zümrüt Yeşili, Siberpunk, AMOLED Siyahı, Temiz Açık, Kadife Mor).
- **🔍 Canlı Filtreleme ve Sıralama**: Proje adı veya dosya yolu üzerinden anlık arama; boyuta, son değiştirilme tarihine veya paket yöneticisine (`npm`, `pnpm`, `yarn`, `bun`) göre sıralama.
- **⌨️ Klavye ve Erişilebilirlik (A11y)**: `Yukarı/Aşağı Ok Tuşları` ile satır dolaşımı, `Boşluk (Space)` ile seçim, `Ctrl+A` ile tümünü seçme ve `Escape` ile seçimi temizleme kısayolları.
- **🔐 Otomatik Checksum ve Release Doğrulama**: Tek tıkla Setup (.exe), MSI ve Taşınabilir (Portable) paketler üreten ve otomatik SHA-256 imzalarını oluşturan entegre derleme sistemi.

---

## 🛠️ Tech Stack (Teknoloji Yığını)

<div align="center">

![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=tauri&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-DEA584?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4338CA?style=for-the-badge)

</div>

- **Masaüstü Altyapısı**: Tauri v2.0 (Yerel WebView2 entegrasyonu ve minimum RAM tüketimi)
- **Çekirdek Backend**: Rust 2021 (Tokio asenkron çalışma zamanı, `walkdir`, `trash`, Windows Win32 Shell API)
- **Frontend Çatısı**: React 19.0 & TypeScript 5.7
- **Derleme Aracı**: Vite 6.4 ve modüler Rollup chunk bölümleme (`vendor-core`, `vendor-ui`, `locales-bundle`)
- **Durum Yönetimi**: Zustand 5.0 (Tarama, seçim, arayüz ve tercihler için atomik store'lar)
- **Sanallaştırma & Arayüz**: `@tanstack/react-virtual` 3.13, `lucide-react` ve CSS Özel Değişken Tasarım Sistemi
- **Test Kapsamı**: Vitest 3.2 (Frontend) ve Rust Yerleşik Test Paketi (`cargo test`)

---

## 📁 Project Structure (Proje Klasör Yapısı)

```tree
node_cleaner/
├── assets/                         # Vektörel marka varlıkları ve logo
│   └── brand/
│       ├── app-icon.svg
│       └── logo-master.svg
├── scripts/                        # Otomatik release derleme ve doğrulama araçları
│   ├── build-release.js            # Tek tıkla release derleyicisi ve SHA-256 üreticisi
│   ├── check-version.js            # Üç katmanlı sürüm senkronizasyon doğrulayıcısı
│   └── verify-checksums.bat        # Çift tıklamalı hash doğrulama betiği
├── src/                            # Frontend İstemci Uygulaması (React 19 + TypeScript)
│   ├── app/                        # Uygulama kabuğu, başlatıcı ve ana düzen
│   ├── components/                 # Primitifler, marka, düzen ve pencere kontrolleri
│   │   ├── brand/                  # Logo ve tipografi bileşenleri
│   │   ├── common/                 # Hata yakalayıcı (ErrorBoundary) ve genel diyaloglar
│   │   ├── layout/                 # Özel çerçevesiz pencere kontrolleri (WindowControls)
│   │   └── primitives/             # GlassSurface, Button, Checkbox, Toast vb.
│   ├── features/                   # Özellik modülleri
│   │   ├── deletion/               # Geri Dönüşüm ve Kalıcı Silme onay diyalogları
│   │   ├── results/                # Sanallaştırılmış tablo, proje satırları ve işlem çubuğu
│   │   ├── scan/                   # ScanHeader, ScanHero, kontrolcü ve yardımcılar
│   │   └── settings/               # Ayarlar paneli, temalar, favoriler ve dil araması
│   ├── lib/                        # Tauri IPC sarmalayıcısı ve formatlayıcılar
│   ├── locales/                    # 73 Bağımsız Dil Modülü
│   │   ├── langs/                  # Ayrı dil dosyaları (tr.ts, en.ts, de.ts...)
│   │   ├── dictionaries.ts         # Merkezi sözlük birleştiricisi
│   │   ├── languages.ts            # Dil metaveri listesi
│   │   └── types.ts                # TypeScript katı çeviri şeması
│   ├── stores/                     # Zustand durum yönetimi mağazaları
│   └── styles/                     # Saf CSS tema değişkenleri ve glassmorphism stilleri
├── src-tauri/                      # Rust Masaüstü Arka Uç Motoru
│   ├── capabilities/               # Tauri v2 güvenlik izinleri ve yetenekleri
│   ├── src/
│   │   ├── commands/               # Tauri IPC komut işleyicileri (Tarama, Silme, Ayarlar)
│   │   ├── deletion/               # Koordinatör, Geri Dönüşüm, Kalıcı Silme ve SEC-DEL Bariyeri
│   │   ├── error/                  # Tip güvenli AppError ve DTO eşleştirmeleri
│   │   ├── platform/               # Windows Shell ve bilinen klasör çözümleyicileri
│   │   ├── scanner/                # Keşif, Boyut Hesaplama ve İptal belirteçleri
│   │   ├── settings/               # Atomik yapılandırma deposu
│   │   ├── lib.rs                  # Uygulama başlatma ve eklenti yükleme
│   │   └── main.rs                 # Yerel ikili dosya giriş noktası
│   ├── Cargo.toml                  # Rust bağımlılıkları ve optimize release profili
│   └── tauri.conf.json             # Tauri pencere, güvenlik ve paket metaverileri
├── package.json                    # Node bağımlılıkları ve proje komutları
├── tsconfig.json                   # TypeScript yapılandırması
├── vite.config.ts                  # Vite ve Rollup chunk yapılandırması
└── README.md                       # Dokümantasyon
```

---

## 🛡️ Security & Architecture (Güvenlik ve Mimari)

| Katman | Bileşen | Güvenlik / Performans Garantisi |
| :--- | :--- | :--- |
| **Güvenlik Bariyeri** | `guard.rs` | Klasör adının tam olarak `node_modules` olduğunu doğrular; derinlik $\ge 3$ şartı arar, kök ve sistem dizinlerini engeller. |
| **Keşif Motoru** | `discovery.rs` | `WalkDir` ve `skip_current_dir()` kullanarak `node_modules` altındaki dosyaları taramadan atlar. |
| **Boyut Ölçümü** | `size.rs` | Tokio asenkron iş parçacıkları `(CPU / 2).clamp(2, 4)` semaforu ile disk kuyruğunu kilitlemeden ölçüm yapar. |
| **Geri Dönüşüm** | `recycle_bin.rs` | Yerel `SHFileOperationW` entegrasyonu ile silinen klasörlerin Windows Geri Dönüşüm Kutusu'ndan Ctrl+Z ile kurtarılmasını sağlar. |
| **Ayarların Kaydı** | `repository.rs` | Önce geçici `.tmp` dosyasına yazıp ardından atomik olarak hedef dosyanın üzerine yazar; elektrik kesintisinde ayarların bozulmasını önler. |

---

## ⚙️ Installation & Usage (Kurulum ve Kullanım)

### Gereksinimler
- [Node.js](https://nodejs.org/) (18.0 veya üzeri)
- [Rust & Cargo](https://www.rust-lang.org/tools/install) (en güncel kararlı sürüm)
- Windows 10 / 11 (64-bit) ve kurulu WebView2 çalışma zamanı

### Adım Adım Kurulum

1. **Depoyu Klonlayın:**
   ```bash
   git clone https://github.com/emirtdede/Node-Cleaner.git
   cd Node-Cleaner
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Otomatik Testleri Çalıştırın:**
   ```bash
   npm test
   cargo test --manifest-path src-tauri/Cargo.toml
   ```

4. **Statik Tip Kontrolünü Doğrulayın:**
   ```bash
   npx tsc --noEmit
   ```

5. **Uygulamayı Geliştirme Modunda Başlatın:**
   ```bash
   npm run tauri dev
   ```

6. **Production Release Paketlerini Derleyin (Setup, MSI, Portable):**
   ```bash
   npm run build:release
   ```
   *Derlenen kurulum paketleri, portable çalıştırılabilir dosya ve SHA-256 hash özetleri şu klasöre kaydedilir:* `release_output/`

---

## ⚖️ License (Lisans)

Bu proje **MIT Lisansı** ile lisanslanmıştır. Detaylar için `LICENSE` dosyasına başvurabilirsiniz.
