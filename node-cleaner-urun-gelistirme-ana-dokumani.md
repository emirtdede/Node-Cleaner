# Node Cleaner — Ürün Geliştirme Ana Dokümanı

> **Belge türü:** PRD + SRS + SAD + UI/UX + Tasarım Sistemi + Tema + Dil + Güvenlik + Performans + Risk + Test + Dağıtım + Kabul Kriterleri  
> **Çalışma adı:** Node Cleaner  
> **Hedef platform:** Windows 10 / Windows 11, öncelik Windows 11  
> **Belge dili:** Türkçe  
> **Sürüm:** 1.0  
> **Tarih:** 29 Ağustos 2026  
> **Durum:** Geliştirmeye hazır teknik ana spesifikasyon  
> **Not:** Proje kök dizinine daha sonra eklenecek Liquid Glass örneği görsel referans olarak incelenecek ve bu belgedeki performans, erişilebilirlik ve mimari kuralları ihlal etmeden uygulanacaktır.

---

# 1. Belgenin amacı

Bu belge, Node Cleaner masaüstü uygulamasını baştan sona geliştirmek için gereken ürün, yazılım, mimari, kullanıcı deneyimi, görsel tasarım, performans, güvenlik, test ve dağıtım gereksinimlerini tek bir kaynakta toplar.

Belgenin temel hedefleri:

1. Geliştirme sırasında gereksiz karar tekrarını azaltmak.
2. Bir geliştirici veya kodlama ajanının ürünü eksik varsayımlarla geliştirmesini önlemek.
3. UI/UX kalitesini işlevsel gereksinimlerle aynı seviyede bir ürün gereksinimi haline getirmek.
4. Performans ve sistem kaynak tüketimi için ölçülebilir hedefler tanımlamak.
5. Dosya silme gibi geri dönüşü olmayan işlemlerde güvenlik sınırları belirlemek.
6. Kod tabanının modüler, test edilebilir ve uzun vadede sürdürülebilir olmasını zorunlu kılmak.
7. Uygulamanın tamamen Türkçe, sade, premium ve tutarlı bir masaüstü deneyimi sunmasını sağlamak.

Bu belge geliştirme sırasında **tek gerçek kaynak** olarak kabul edilmelidir. Bir uygulama davranışı bu belgede açık biçimde tanımlanmışsa farklı şekilde uygulanmamalıdır.

---

# 2. Ürün özeti

Node Cleaner, kullanıcının seçtiği klasörler altında bulunan `node_modules` dizinlerini yüksek performansla tarayan, proje bazında gösteren, boyut ve kullanım bilgileriyle karşılaştıran ve seçilen dizinleri:

- Windows Çöp Kutusu'na taşıyabilen,
- veya açık kullanıcı onayıyla kalıcı olarak silebilen

yerel bir Windows masaüstü uygulamasıdır.

Uygulama:

- arka planda otomatik tarama yapmaz,
- dosya sistemi watcher çalıştırmaz,
- periyodik polling yapmaz,
- ağ bağlantısı gerektirmez,
- kullanıcı istemedikçe herhangi bir klasörü taramaz,
- tarama sırasında sistem kaynaklarını kontrollü kullanır,
- boşta beklerken mümkün olduğunca sıfıra yakın CPU tüketir.

Ana ürün ilkesi:

> **Kullanıcıya disk alanını geri kazandırırken bilgisayarın normal kullanımını hissedilir biçimde yavaşlatmamak.**

İkinci ana ürün ilkesi:

> **Güçlü bir sistem aracı gibi çalışmalı, fakat karmaşık bir sistem aracı gibi görünmemelidir.**

---

# 3. Ürün vizyonu

Node Cleaner'ın hedeflediği deneyim:

- Apple ürünlerindeki görsel sadelik ve hiyerarşi,
- Windows masaüstü uygulamasının doğal davranışları,
- geliştirici araçlarının işlevsel doğruluğu,
- premium bir ticari uygulamanın detay seviyesi,
- küçük bir yardımcı aracın kaynak verimliliği

aynı üründe birleştirilmelidir.

Uygulamanın kullanıcıda oluşturması gereken algı:

- hızlı,
- güvenilir,
- temiz,
- sessiz,
- modern,
- profesyonel,
- gereksiz özelliği olmayan,
- yaptığı tek işi çok iyi yapan.

---

# 4. Hedef kullanıcı

## 4.1. Birincil kullanıcı

Bireysel yazılım geliştiriciler.

Tipik kullanım profili:

- aynı bilgisayarda 10–100+ yazılım projesi,
- Node.js, React, Next.js, Vite, Electron veya benzeri JavaScript/TypeScript projeleri,
- birden fazla package manager kullanımı,
- eski projelerde GB seviyesinde unutulmuş `node_modules` dizinleri,
- proje dosyasını koruyup bağımlılık klasörünü silme ihtiyacı,
- masaüstü GUI tercih etme,
- CLI aracını kullanabilecek teknik seviyede olsa da daha hızlı ve görsel bir iş akışı isteme.

## 4.2. İkincil kullanıcı

- frontend geliştiricileri,
- full-stack geliştiricileri,
- ajans çalışanları,
- öğrenciler,
- çok sayıda demo/prototip tutan geliştiriciler.

---

# 5. Kapsam

## 5.1. MVP kapsamında

- Windows 10 ve Windows 11 desteği.
- Kullanıcı tarafından klasör seçimi.
- Hazır hızlı konumlar.
- Sık kullanılan klasörler.
- `node_modules` klasörlerinin recursive taranması.
- Proje kökünün tespiti.
- `package.json` bilgisinin okunması.
- Package manager tespiti.
- `node_modules` boyutunun hesaplanması.
- Son değiştirilme bilgisinin gösterilmesi.
- Sonuçları listeleme.
- Arama.
- Sıralama.
- Çoklu seçim.
- Seçilen toplam alanın hesaplanması.
- Windows Çöp Kutusu'na taşıma.
- Kalıcı silme.
- Tarama iptali.
- Tarama hata toleransı.
- Tema sistemi.
- Premium Liquid Glass görsel sistemi.
- Tam Türkçe arayüz.
- Ayarların yerel olarak saklanması.
- Pencere boyutu/konumu hatırlama.
- Özel SVG logo.
- SVG arayüz ikonları.
- Windows `.ico` paketinin birden fazla çözünürlükle üretilmesi.
- MSI veya NSIS kurulum çıktısı.
- Otomatik testler.
- Performans testleri.

## 5.2. MVP dışında

Aşağıdakiler ilk sürümde yapılmayacaktır:

- kullanıcı hesabı,
- bulut senkronizasyonu,
- telemetry,
- analytics,
- reklam,
- otomatik disk temizleme,
- zamanlanmış tarama,
- dosya sistemi watcher,
- `dist`, `.next`, `build`, `.turbo`, `.cache` temizliği,
- paket bağımlılık analizi,
- npm cache temizleme,
- Docker temizleme,
- macOS/Linux desteği,
- uzaktan bilgisayar tarama,
- ağ diski optimizasyonu,
- otomatik silme politikaları,
- sistem başlangıcında otomatik tarama.

Bu özellikler ancak v1 stabil olduktan sonra ayrı değerlendirilmelidir.

---

# 6. Başarı kriterleri

Ürün başarılı kabul edilirken yalnızca “çalışıyor” olması yeterli değildir.

## 6.1. İşlevsel başarı

- Seçilen klasördeki gerçek `node_modules` dizinlerini doğru bulmalıdır.
- İç içe bağımlılık klasörlerini ayrı proje gibi göstermemelidir.
- Çöp Kutusu işlemi gerçek Windows Çöp Kutusu davranışıyla sonuçlanmalıdır.
- Kalıcı silme yanlış klasörü silemeyecek güvenlik kontrollerine sahip olmalıdır.
- Sonuç listesi yüzlerce kayıt olduğunda kullanılabilir kalmalıdır.

## 6.2. Performans başarısı

Hedefler referans donanımda ölçülmelidir:

- Windows 11,
- NVMe SSD,
- 16 GB RAM,
- 8 mantıksal işlemci veya üzeri,
- WebView2 güncel sürüm.

Hedef değerler:

| Ölçüm | Hedef |
|---|---:|
| Boşta ortalama CPU | <%0,5 |
| Boşta sürekli disk I/O | 0 |
| Boşta ağ I/O | 0 |
| Boşta bellek | tercihen <120 MB |
| İlk pencere görünümü | tercihen <1,5 sn |
| UI ana thread bloklanması | görünür seviyede olmamalı |
| Tarama iptaline cevap | <250 ms hedef |
| UI progress güncelleme | en fazla yaklaşık 10 Hz |
| Büyük sonuç listesi | sanallaştırılmış liste |
| Tarama sırasında CPU | adaptif ve sınırlandırılmış |
| Tarama sırasında UI FPS | hissedilir takılma olmamalı |

Bunlar **performans bütçeleridir**, donanım ve WebView2 sürümüne göre küçük sapmalar kabul edilebilir. Ancak regresyon testinde önceki sürüme göre belirgin kötüleşme kabul edilmez.

## 6.3. UX başarısı

Yeni kullanıcı:

1. uygulamayı açmalı,
2. bir klasör seçmeli,
3. taramayı başlatmalı,
4. sonuçları anlamalı,
5. istediği projeleri seçmeli,
6. Çöp Kutusu'na taşımalı

ve bunu yardım dokümanı okumadan yapabilmelidir.

---

# 7. Teknoloji kararı

## 7.1. Masaüstü runtime

**Tauri 2**

Gerekçeler:

- Rust backend.
- İşletim sisteminin WebView altyapısını kullanması.
- Electron'a kıyasla ayrı Chromium runtime paketleme ihtiyacının olmaması.
- Windows native API'lerine Rust üzerinden kontrollü erişim.
- Tauri capability sistemiyle frontend izinlerinin sınırlandırılabilmesi.
- Windows pencere efektleri için Mica/Acrylic gibi seçeneklerin bulunması.
- Küçük utility uygulamalar için uygun dağıtım modeli.

## 7.2. Frontend

- React
- TypeScript
- Vite
- CSS Modules veya feature-scoped CSS
- CSS Custom Properties ile design token sistemi
- Zustand ile sınırlı ve domain bazlı istemci durumu
- TanStack Virtual veya eşdeğer hafif sanallaştırma çözümü

## 7.3. Backend

- Rust
- Tauri command/channel köprüsü
- `windows` crate ile gerektiğinde Win32/COM entegrasyonu
- Dosya sistemi taraması için Rust native traversal
- JSON/TOML tabanlı küçük kullanıcı ayarı deposu

## 7.4. UI ikonları

Birincil öneri:

- **Lucide** SVG ikon seti

Kurallar:

- tüm ikonlar SVG,
- emoji yasak,
- metin içine Unicode sembol ikonu konulmamalı,
- aynı stroke kalınlığı ailesi kullanılmalı,
- ikon boyutları design token üzerinden kontrol edilmeli,
- gerektiğinde özel ikon tasarlanabilir,
- ürün logosu hazır ikon setinden alınmamalı; özel tasarlanmalıdır.

---

# 8. Yüksek seviye mimari

```text
┌────────────────────────────────────────────────────────────┐
│                     React / TypeScript                     │
│                                                            │
│  Shell                                                     │
│  ├── Navigation                                            │
│  ├── Scan Screen                                           │
│  ├── Results                                               │
│  ├── Favorites                                             │
│  ├── Settings                                              │
│  └── Dialogs                                               │
│                                                            │
│  UI state        Domain stores       Theme tokens          │
└────────────────────────────┬───────────────────────────────┘
                             │
                       Tauri IPC/Channel
                             │
┌────────────────────────────▼───────────────────────────────┐
│                         Rust Core                          │
│                                                            │
│  scanner/          project/          deletion/             │
│  ├ discovery       ├ metadata        ├ recycle-bin         │
│  ├ size            ├ package mgr     ├ permanent           │
│  ├ cancellation    └ validation      └ safeguards          │
│                                                            │
│  settings/         platform/windows/   telemetry: none      │
└────────────────────────────┬───────────────────────────────┘
                             │
                 Windows Filesystem / Shell API
```

---

# 9. Mimari ilkeler

## ARCH-001 — UI ve dosya sistemi ayrımı

Frontend doğrudan keyfi dosya sistemi erişimi yapmamalıdır.

Dosya tarama, boyut hesaplama ve silme işlemleri Rust backend üzerinden gerçekleştirilir.

## ARCH-002 — God Context yasak

Tek bir React Context içinde aşağıdakilerin tamamının tutulması yasaktır:

- tarama durumu,
- sonuç listesi,
- tema,
- ayarlar,
- seçim,
- dialog,
- favoriler,
- pencere durumu.

Önerilen ayrım:

```text
stores/
├── scan-store.ts
├── selection-store.ts
├── preferences-store.ts
└── ui-store.ts
```

Tema için mümkünse DOM `data-theme` + CSS token tercih edilir.

React Context yalnızca gerçekten tree-scoped ihtiyaçlarda kullanılmalıdır.

## ARCH-003 — Feature-first klasörleme

Frontend:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.ts
│   └── providers/
├── features/
│   ├── scan/
│   ├── results/
│   ├── favorites/
│   ├── deletion/
│   ├── settings/
│   └── theme/
├── components/
│   ├── primitives/
│   └── shared/
├── lib/
├── styles/
└── types/
```

Rust:

```text
src-tauri/src/
├── lib.rs
├── commands/
│   ├── scan_commands.rs
│   ├── deletion_commands.rs
│   └── settings_commands.rs
├── scanner/
│   ├── mod.rs
│   ├── discovery.rs
│   ├── size.rs
│   ├── metadata.rs
│   ├── cancellation.rs
│   └── models.rs
├── deletion/
│   ├── mod.rs
│   ├── recycle_bin.rs
│   ├── permanent.rs
│   └── guard.rs
├── settings/
│   ├── mod.rs
│   ├── model.rs
│   └── repository.rs
├── platform/
│   └── windows/
│       ├── known_folders.rs
│       ├── file_operation.rs
│       └── priority.rs
└── error/
    └── app_error.rs
```

## ARCH-004 — Dependency inversion

Deletion sistemi:

```rust
trait DeletionService {
    fn recycle(&self, paths: &[PathBuf]) -> Result<DeletionReport>;
    fn permanent_delete(&self, paths: &[PathBuf]) -> Result<DeletionReport>;
}
```

UI herhangi bir Windows API detayını bilmez.

Scanner:

```rust
trait ProjectScanner {
    fn scan(&self, request: ScanRequest, sink: ScanSink) -> Result<ScanSummary>;
}
```

Bu ayrım test double kullanımını kolaylaştırır.

## ARCH-005 — Uzun süren iş UI thread üzerinde çalışmaz

- recursive traversal,
- boyut hesaplama,
- silme

React render thread veya Tauri ana UI thread üzerinde yürütülmez.

---

# 10. Temel veri modelleri

## 10.1. ScanRoot

```ts
type ScanRoot = {
  id: string;
  path: string;
  label: string;
  source: "manual" | "default" | "favorite" | "recent";
};
```

## 10.2. NodeModuleEntry

```ts
type NodeModuleEntry = {
  id: string;
  nodeModulesPath: string;
  projectPath: string;
  projectName: string;
  packageManager: "npm" | "pnpm" | "yarn" | "bun" | "unknown";
  sizeBytes: number | null;
  modifiedAt: string | null;
  packageJsonFound: boolean;
  lockfile?: string;
  status: "ready" | "measuring" | "error" | "deleted";
  errorCode?: string;
};
```

## 10.3. ScanRequest

```ts
type ScanRequest = {
  rootPath: string;
  exclusions: string[];
};
```

## 10.4. ScanProgress

```ts
type ScanProgress = {
  phase: "discovering" | "measuring";
  directoriesVisited: number;
  entriesFound: number;
  entriesMeasured: number;
  bytesMeasured: number;
  currentPath?: string;
};
```

## 10.5. FavoriteLocation

```ts
type FavoriteLocation = {
  id: string;
  label: string;
  path: string;
  createdAt: string;
  lastUsedAt: string | null;
};
```

---

# 11. Fonksiyonel gereksinimler — SRS

## FR-001 — Klasör seçimi

Kullanıcı native Windows klasör seçici üzerinden bir tarama kökü seçebilmelidir.

Koşullar:

- yalnızca klasör,
- tek seçim,
- iptal güvenli,
- seçilen path UI'da açıkça gösterilir.

## FR-002 — Varsayılan hızlı konumlar

Uygulama mevcutsa aşağıdaki tipte konumları hızlı seçim olarak sunmalıdır:

- Masaüstü
- Belgeler
- `Projects`
- `Code`
- `Dev`
- `Development`
- Visual Studio için `source\repos`

Sistem klasörleri mümkün olduğunca Windows Known Folder API üzerinden çözülmelidir.

Sabit `C:\Users\...` path üretmek yasaktır.

Heuristik klasörler yalnızca gerçekten mevcutsa gösterilir.

Cloud-backed/OneDrive klasörü algılanırsa otomatik taranmaz; kullanıcı açıkça seçerse taranabilir.

## FR-003 — Sık kullanılanlar

Kullanıcı bir klasörü sık kullanılanlara ekleyebilmelidir.

Kullanıcı:

- favori ekleyebilir,
- yeniden adlandırabilir,
- favoriden çıkarabilir,
- favoriye tıklayarak hızlı seçim yapabilir.

Favoriler yerel olarak saklanır.

Favori silmek gerçek klasörü silmez.

## FR-004 — Son kullanılanlar

Son kullanılan en fazla 5 farklı tarama konumu opsiyonel hızlı erişim olarak gösterilebilir.

Aynı path duplicate tutulmaz.

## FR-005 — Tarama

Kullanıcı “Tara” düğmesiyle explicit tarama başlatır.

Uygulama açıldığında otomatik tarama yapılmaz.

## FR-006 — Tarama iptali

Tarama devam ederken:

- “Taramayı Durdur” eylemi görünür olmalı,
- iptal token backend'e iletilmeli,
- yeni traversal işleri durdurulmalı,
- mevcut kısa dosya sistemi işlemleri tamamlandıktan sonra scanner kontrollü şekilde çıkmalıdır,
- bulunan sonuçlar korunabilir.

## FR-007 — `node_modules` keşfi

Tarayıcı yalnızca dizin adı tam olarak:

```text
node_modules
```

olan klasörleri aday olarak kabul eder.

Case handling Windows dosya sistemi davranışına uygun olmalıdır.

## FR-008 — Alt `node_modules` içine inilmemesi

Bir `node_modules` bulunduğu anda discovery traversal o dizinin altına girmemelidir.

Ama boyut hesaplama aşaması o dizinin tüm içeriğini ayrıca ölçebilir.

Amaç:

- nested package dependency `node_modules` klasörlerini ayrı proje olarak listelememek,
- discovery maliyetini düşürmek.

## FR-009 — Symlink/junction davranışı

Varsayılan davranış:

- symbolic link takip edilmez,
- directory junction/reparse point takip edilmez,
- loop oluşturabilecek path ilişkilerine girilmez.

Kullanıcıya MVP'de “symlink takip et” seçeneği verilmez.

## FR-010 — Proje kökü tespiti

`node_modules` klasörünün parent dizini birincil proje kökü kabul edilir.

Parent içinde `package.json` aranır.

`package.json` bulunmazsa sonuç yine gösterilebilir ancak:

```text
packageJsonFound = false
```

olur.

## FR-011 — Proje adı

Öncelik:

1. `package.json` içindeki `name`
2. proje klasörü adı
3. path'ten türetilmiş güvenli fallback

UI'da path ayrıca gösterilir.

## FR-012 — Package manager tespiti

Öncelik:

1. `package.json` `packageManager`
2. `pnpm-lock.yaml`
3. `yarn.lock`
4. `bun.lock` / ilgili Bun lock dosyası
5. `package-lock.json`
6. bilinmiyor

Birden fazla lockfile varsa deterministic precedence uygulanır ve ileride uyarı göstermek için metadata korunabilir.

## FR-013 — Boyut hesaplama

Her `node_modules` için recursive logical byte toplamı hesaplanır.

Kurallar:

- `u64` kullanılmalı,
- erişilemeyen dosyalar bütün sonucu düşürmemeli,
- partial error sayısı tutulmalı,
- overflow korunmalı,
- dosya linkleri takip edilmemeli.

UI önce sonucu “hesaplanıyor” durumunda gösterebilir ve size sonradan stream edilebilir.

## FR-014 — Son değiştirilme zamanı

En azından `node_modules` klasör metadata'sındaki modified time okunur.

Bu bilgi “son proje kullanımı” ile aynı şey değildir.

UI etiketi:

- “Son değişiklik”

olmalıdır; “Son kullanım” yazılmamalıdır.

## FR-015 — Sonuç listesi

Her satırda minimum:

- seçim kutusu,
- proje adı,
- proje yolu,
- package manager,
- boyut,
- son değişiklik,
- satır eylemleri

gösterilmelidir.

## FR-016 — Sıralama

Minimum sıralamalar:

- Boyut: büyükten küçüğe
- Boyut: küçükten büyüğe
- Son değişiklik: eskiden yeniye
- Son değişiklik: yeniden eskiye
- Proje adı: A-Z
- Proje adı: Z-A

Varsayılan:

**Boyut — büyükten küçüğe**

## FR-017 — Arama

Arama aşağıdakilerde case-insensitive çalışmalıdır:

- proje adı,
- proje path'i.

Arama frontend derived selector olabilir.

Büyük listede debounce kullanılabilir; hedef 100–150 ms.

## FR-018 — Çoklu seçim

Kullanıcı:

- tek satır,
- birden fazla satır,
- görünür filtre sonucunun tamamı

seçebilmelidir.

Seçim `id` bazlı tutulmalıdır.

Tam entry objeleri selection store'a duplicate edilmemelidir.

## FR-019 — Seçili alan bilgisi

Alt action bar:

- seçilen öğe sayısı,
- seçilen toplam boyut

göstermelidir.

Boyutu henüz hesaplanmamış öğe varsa durum kullanıcıya yanlış kesinlikle verilmemelidir.

## FR-020 — Çöp Kutusu

Birincil güvenli silme eylemi:

**“Çöp Kutusu'na Taşı”**

olmalıdır.

Windows'ta native Shell davranışı kullanılmalıdır.

Tercih edilen teknik yaklaşım:

- `IFileOperation`
- `FOFX_RECYCLEONDELETE`
- `DeleteItem/DeleteItems`
- `PerformOperations`

Bu entegrasyon ayrı bir Windows platform adapter içinde bulunmalıdır.

MVP geliştirme süresini düşürmek için `trash` crate kullanılacaksa, dışarıya aynı `DeletionService` interface'i verilmelidir; böylece daha sonra native adapter'a geçiş kolay olmalıdır.

## FR-021 — Kalıcı silme

İkincil destructive eylem:

**“Kalıcı Olarak Sil”**

olmalıdır.

Kalıcı silme:

- Çöp Kutusu'na taşımaz,
- geri alınamaz,
- ayrı modal ister,
- seçilen sayı ve toplam boyutu tekrar gösterir,
- primary buton destructive stil taşır,
- default focused button “Vazgeç” veya güvenli seçenek olmalıdır.

Toplu kalıcı silmede ikinci confirmation zorunludur.

## FR-022 — Silme sonrası sonuç güncelleme

Başarılı silinen entry:

- listeden kaldırılabilir,
- veya kısa süre “Silindi” state'i gösterilip kaldırılabilir.

Tavsiye:

- 500–800 ms success transition,
- ardından satırın listeden kalkması.

Başarısız öğeler listede kalır.

## FR-023 — Kısmi silme hatası

Toplu silmede bazı klasörler silinip bazıları silinemezse uygulama:

- tüm işlemi başarısız göstermemeli,
- başarı sayısı,
- hata sayısı,
- hatalı path'ler

raporlamalıdır.

## FR-024 — Dosya Gezgini'nde aç

Her sonuç satırında:

**“Klasörü Dosya Gezgini'nde Aç”**

eylemi bulunabilir.

Direkt `node_modules` yerine tercihen proje kökü açılır.

## FR-025 — Path kopyalama

Context menu veya satır menüsünde:

**“Yolu Kopyala”**

bulunmalıdır.

## FR-026 — Yeniden tarama

Tarama bittikten sonra aynı path için:

**“Yeniden Tara”**

eylemi bulunur.

## FR-027 — Ayarlar

Minimum:

- tema,
- azaltılmış hareket,
- varsayılan silme davranışı tercihi gösterimi,
- sık kullanılan yönetimi,
- uygulama sürümü

içermelidir.

Kalıcı silmeyi varsayılan primary action yapmak yasaktır.

---

# 12. Tarama motoru tasarımı

## 12.1. İki aşamalı tarama

Tarama iki faza ayrılmalıdır.

### Faz A — Discovery

Amaç:

- `node_modules` path'lerini hızlı bulmak,
- parent projeyi belirlemek,
- pahalı size hesaplamasını discovery'den ayırmak.

Pseudo-flow:

```text
scan(root)
  ↓
walk directories
  ↓
is reparse/symlink?
  ├─ yes → skip
  └─ no
      ↓
directory name == node_modules?
  ├─ no → continue
  └─ yes
      ↓
emit candidate
      ↓
skip children of node_modules
```

### Faz B — Measurement

Bulunan adaylar bounded worker pool üzerinden ölçülür.

Bu sayede kullanıcı sonuçları taramanın tamamen bitmesini beklemeden görmeye başlayabilir.

## 12.2. Bounded concurrency

“Ne kadar çok thread o kadar hızlı” yaklaşımı yasaktır.

Önerilen varsayılan:

```text
discovery worker: 1 ana traversal
size workers: min(4, max(2, logical_cpu / 2))
```

Daha konservatif başlangıç için Windows üzerinde 2 size worker tercih edilebilir.

Gerçek değer benchmark ile belirlenmelidir.

## 12.3. Adaptif performans

MVP'de kullanıcıya “Hızlı / Dengeli / Eco” gibi karmaşık seçenekler göstermeye gerek yoktur.

Uygulama kendi içinde konservatif “Dengeli” profil kullanır.

İleride performans modu eklenirse:

- Sessiz
- Dengeli
- Hızlı

şeklinde eklenebilir.

## 12.4. Worker thread önceliği

Windows scanner worker thread'leri için uygun görülürse `THREAD_PRIORITY_BELOW_NORMAL` değerlendirilebilir.

Ama:

- UI thread etkilenmemeli,
- test edilmeden zorunlu yapılmamalı,
- thread priority kullanımının ölçülebilir faydası benchmark ile doğrulanmalıdır.

## 12.5. IPC flood önleme

Her dosya için frontend event göndermek yasaktır.

Backend:

- progress'i batch eder,
- yaklaşık maksimum 10 Hz ile günceller,
- bulunan sonuçları küçük paketler halinde iletir.

Örnek:

```text
50 result veya 100 ms
hangisi önce dolarsa gönder
```

Gerçek değer testle ayarlanmalıdır.

## 12.6. Cancellation

Cancellation token:

- atomik,
- lock-free okunabilir,
- traversal döngüsünde belirli aralıklarla kontrol edilir,
- measurement worker'larında kontrol edilir.

Cancellation bir error değildir.

UI state:

```text
idle
scanning
cancelling
completed
cancelled
failed
```

ayrımı yapılmalıdır.

## 12.7. Hata toleransı

Beklenen non-fatal durumlar:

- Access Denied
- dosyanın scan sırasında silinmesi
- path'in kaybolması
- broken symlink
- uzun path
- geçici lock
- metadata okunamaması

Bu durumlarda scanner mümkünse devam eder.

Özet ekranında:

```text
3 klasöre erişilemedi
```

gibi kullanıcı dostu bilgi verilebilir.

---

# 13. Silme güvenlik modeli

Dosya silme uygulamanın en yüksek riskli fonksiyonudur.

## SEC-DEL-001 — Exact basename kontrolü

Silinecek path'in son component'i tam olarak:

```text
node_modules
```

olmalıdır.

Aksi durumda backend işlemi reddeder.

Frontend kontrolü yeterli değildir.

## SEC-DEL-002 — Canonicalization

Silmeden hemen önce:

- path tekrar canonicalize edilir,
- hala var olduğu doğrulanır,
- klasör olduğu doğrulanır,
- basename doğrulanır.

Scan sırasında görülen eski path'e kör güvenilmez.

## SEC-DEL-003 — Root sınırı

Entry'nin project path'i ve `node_modules` path'i ilişkisi doğrulanmalıdır.

Beklenen:

```text
projectPath/node_modules
```

MVP'de alışılmadık workspace yapılarını desteklemek için gerektiğinde daha esnek metadata tutulabilir; ancak silme guard'ı gevşetilmemelidir.

## SEC-DEL-004 — Reparse point kontrolü

Deletion guard:

- junction/reparse point hedeflerini takip etmemeli,
- beklenmedik gerçek path'e resolve olup sistem klasörü silmemelidir.

## SEC-DEL-005 — Sistem path koruması

Aşağıdaki kategorilerde destructive işlem backend'de bloklanmalıdır:

- drive root,
- Windows system directory,
- Program Files root,
- user profile root,
- seçilen scan root'un kendisi,
- proje kökünün kendisi,
- path component sayısı güvenlik eşiğinin altında olan şüpheli root path'ler.

## SEC-DEL-006 — TOCTOU azaltma

Scan sonucu ile silme arasında path değişebileceği için silme anında yeniden doğrulama yapılır.

Tam TOCTOU eliminasyonu her dosya sistemi senaryosunda garanti edilemez; ancak destructive action öncesi revalidation zorunludur.

## SEC-DEL-007 — Kalıcı silme confirmation

Kalıcı silmede UI confirmation zorunludur.

Backend ayrıca `mode = permanent` değerini explicit beklemelidir.

“Boolean isPermanent” yerine enum tercih edilir:

```rust
enum DeleteMode {
    RecycleBin,
    Permanent,
}
```

## SEC-DEL-008 — Toplu işlem izolasyonu

Bir path'teki hata diğer path'lerin raporlanmasını engellememelidir.

---

# 14. Tauri güvenlik modeli

## SEC-001 — Minimum capability

Tauri capability dosyalarında yalnızca gerekli izinler açılır.

Frontend'e broad filesystem scope verilmez.

## SEC-002 — Shell komutu

Arbitrary shell execution yasaktır.

`cmd.exe /c rmdir ...` gibi implementasyon kullanılmamalıdır.

## SEC-003 — Frontend path trust

Frontend'den gelen path güvenilir kabul edilmez.

Backend validation her destructive command'de tekrar yapılır.

## SEC-004 — Network

MVP ağ bağlantısı gerektirmez.

- HTTP client dependency eklenmemeli,
- telemetry olmamalı,
- analytics olmamalı,
- uzaktan font çekilmemeli,
- CDN asset kullanılmamalı.

## SEC-005 — CSP

Tauri Content Security Policy mümkün olduğunca dar tutulmalıdır.

Inline script kullanımından kaçınılır.

## SEC-006 — Dependency güvenliği

CI:

- `cargo audit`
- `pnpm audit` veya uygun modern eşdeğer
- lockfile kontrolü

çalıştırmalıdır.

High/Critical bulgular release blocker olarak değerlendirilmelidir.

## SEC-007 — Update

MVP kişisel/offline kullanımda auto-update kapalı olabilir.

Gelecekte updater eklenirse:

- TLS,
- signed update artifact,
- Tauri updater signature doğrulaması

zorunlu olacaktır.

---

# 15. Performans gereksinimleri

## PERF-001 — Boşta işlem yok

Tarama yokken:

- timer tabanlı polling yok,
- dosya sistemi polling yok,
- periyodik disk kontrolü yok,
- background scan yok.

Saat gibi canlı güncellenen gereksiz UI öğeleri eklenmez.

## PERF-002 — Render kontrolü

React component'leri:

- küçük sorumluluklar,
- selector bazlı store subscription,
- gereksiz global rerender yok.

`useStore()` ile tüm store'u subscribe etmek yasaktır.

Selector:

```ts
useScanStore((s) => s.status)
```

gibi spesifik olmalıdır.

## PERF-003 — Liste sanallaştırma

Sonuç sayısı 100'ü geçmese bile mimari virtualized list'e uygun olmalıdır.

1000 sonuç test fixture ile UI stres testi yapılmalıdır.

## PERF-004 — CSS maliyeti

Ağır blur yalnızca sınırlı surface'lerde.

Her table row üzerinde bağımsız `backdrop-filter: blur(...)` uygulanması yasaktır.

## PERF-005 — Animasyon

Animasyonlarda:

- `transform`,
- `opacity`

tercih edilir.

Layout thrashing oluşturacak width/height/top/left animasyonları minimum tutulur.

## PERF-006 — Transition süresi

Genel:

- hover: 120–160 ms
- button: 120–160 ms
- modal: 160–220 ms
- panel: 180–240 ms

Aşırı “spring” ve bounce kullanılmaz.

## PERF-007 — Reduced motion

`prefers-reduced-motion` desteklenir.

Ayarlar ekranında ek “Hareketleri azalt” seçeneği bulunabilir.

## PERF-008 — Blur fallback

WebView/Windows kombinasyonunda Liquid Glass efekti performans sorunu yaratırsa:

- backdrop blur azaltılır,
- Mica tercih edilir,
- translucent solid fill fallback uygulanır.

Görsel efekt performans kriterinin üzerinde önceliğe sahip değildir.

---

# 16. UI/UX tasarım ilkeleri

## UX-001 — İçeriğin önceliği

Arayüz süsleme değil, sonuçları anlamayı kolaylaştırmalıdır.

## UX-002 — Tek ana iş

Ana ekranın ana görevi:

> Klasör seç → Tara → Sonuç seç → Temizle

Bu akış ekran tasarımının hiyerarşisini belirler.

## UX-003 — Progressive disclosure

Gelişmiş işlemler satır menüsü veya ayarlarda olabilir.

Ana ekranda gereksiz teknik seçenek gösterilmez.

## UX-004 — Destructive hierarchy

Primary safe action:

**Çöp Kutusu'na Taşı**

Destructive secondary:

**Kalıcı Olarak Sil**

Kalıcı silme daha baskın görsel ağırlığa sahip olmamalıdır.

## UX-005 — Empty state

İlk açılış:

```text
Disk alanını geri kazan

Projelerindeki node_modules klasörlerini
bul ve güvenle temizle.

[ Klasör Seç ]   [ Hızlı Konumlar ]
```

Emoji yok.

Empty state'te dekoratif dev illüstrasyon şart değildir.

Logo veya soyut hafif SVG kullanılabilir.

## UX-006 — Tarama state

Tarama sırasında spinner yerine:

- ince progress indicator,
- taranan klasör,
- bulunan proje sayısı

gösterilebilir.

Ama path sürekli yüksek frekansta değişerek görsel gürültü oluşturmamalıdır.

## UX-007 — Sonuç yoğunluğu

Desktop utility olduğu için sonuçlar gereksiz büyük kartlara dönüştürülmemelidir.

Premium görünüm:

- iyi spacing,
- typography,
- line separators,
- subtle hover,
- doğru hiyerarşi

ile sağlanmalıdır.

## UX-008 — Tooltip

İkon-only butonlarda Türkçe tooltip zorunludur.

## UX-009 — Keyboard

Minimum:

- `Ctrl+F`: arama
- `Ctrl+A`: sonuç listesi focus içindeyse tüm görünürleri seç
- `Esc`: modal kapat / tarama confirm panelini kapat
- `Enter`: primary dialog action, destructive modalde güvenli default korunmalı
- `Delete`: doğrudan kalıcı silme yapmamalı

## UX-010 — Focus

Tüm interaktif elemanlarda görünür focus ring olmalıdır.

---

# 17. Ana ekran bilgi mimarisi

Önerilen yapı:

```text
┌─────────────────────────────────────────────────────────────┐
│ Logo  Node Cleaner                             Ayarlar      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Konum                                                      │
│  C:\Users\...\Projects                    [ Değiştir ]      │
│                                                             │
│  Hızlı erişim                                               │
│  [ Masaüstü ] [ Belgeler ] [ Projects ] [ + Sık Kullanılan ]│
│                                                             │
│  [ Tara ]                                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  18 proje                     24,7 GB temizlenebilir        │
│                                                             │
│  [ Ara... ]                         [ Boyut: Büyükten ]      │
│                                                             │
│  □  Proje              Boyut       Son değişiklik   Paket   │
│  ─────────────────────────────────────────────────────────  │
│  □  project-a          3,2 GB      28 gün           pnpm    │
│  □  project-b          2,1 GB      95 gün           npm     │
│  □  project-c          1,7 GB      4 gün            yarn    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  3 seçili · 7,0 GB       [ Kalıcı Olarak Sil ] [ Çöp... ]  │
└─────────────────────────────────────────────────────────────┘
```

Not:

- Gerçek uygulamada ikonlar Lucide SVG ile gösterilir.
- ASCII yalnızca dokümantasyon amaçlıdır.
- “Çöp...” gerçek UI metni değildir; gerçek buton tam metin veya tooltip ile anlaşılır olmalıdır.

---

# 18. Liquid Glass tasarım sistemi

## 18.1. Tasarım yaklaşımı

Apple Liquid Glass birebir kopyalanmaya çalışılmamalıdır.

Benimsenecek ilkeler:

- katman hiyerarşisi,
- translucency,
- controlled blur,
- edge highlight,
- ince border,
- içerikten renk alan yüzey hissi,
- düşük kontrastlı noise,
- kontrollü shadow,
- modern radius sistemi,
- sade navigasyon.

Liquid Glass uygulamanın **işlevsel katmanında** kullanılmalıdır:

Uygun:

- titlebar,
- toolbar,
- hızlı konum strip,
- floating action bar,
- modal,
- compact popover.

Uygun değil:

- her sonuç satırı,
- tüm content background,
- büyük metin bloklarının altı,
- aynı anda 10+ blur surface.

## 18.2. Proje kökündeki örnek

Kök dizine sağlanacak Liquid Glass örneği:

1. görsel dili açısından incelenecek,
2. renk/blur/border/radius davranışı çıkarılacak,
3. performans profili ölçülecek,
4. doğrudan kopyalamadan önce bağımlılıkları değerlendirilecek,
5. bu belgenin erişilebilirlik ve performans sınırlarına göre adapte edilecektir.

Örnek kod bu belgenin mimari kurallarını geçersiz kılmaz.

---

# 19. Tema sistemi

Beş tema tanımlanacaktır.

## THEME-001 — Beyaz

Opaque/light tema.

```css
--app-bg: #F5F5F7;
--surface: rgba(255, 255, 255, 0.92);
--surface-strong: #FFFFFF;
--text-primary: #111113;
--text-secondary: #66666B;
--border: rgba(0, 0, 0, 0.08);
--separator: rgba(0, 0, 0, 0.06);
--shadow: rgba(0, 0, 0, 0.10);
```

## THEME-002 — Siyah

Opaque/dark tema.

```css
--app-bg: #0B0B0D;
--surface: rgba(22, 22, 24, 0.96);
--surface-strong: #171719;
--text-primary: #F5F5F7;
--text-secondary: #A4A4AA;
--border: rgba(255, 255, 255, 0.10);
--separator: rgba(255, 255, 255, 0.07);
--shadow: rgba(0, 0, 0, 0.35);
```

## THEME-003 — Transparan

Sistem görünümünden türeyen yüksek translucency tema.

- Windows 11: Mica öncelikli.
- CSS glass yalnızca fonksiyonel surface.
- readability için adaptif overlay.

## THEME-004 — Beyaz Transparan

```css
--glass-bg: rgba(255, 255, 255, 0.56);
--glass-bg-strong: rgba(255, 255, 255, 0.72);
--glass-border: rgba(255, 255, 255, 0.55);
--glass-inner-highlight: rgba(255, 255, 255, 0.36);
--text-primary: #111113;
--text-secondary: #5F6065;
```

## THEME-005 — Koyu Transparan

```css
--glass-bg: rgba(18, 18, 21, 0.62);
--glass-bg-strong: rgba(24, 24, 28, 0.76);
--glass-border: rgba(255, 255, 255, 0.11);
--glass-inner-highlight: rgba(255, 255, 255, 0.06);
--text-primary: #F4F4F5;
--text-secondary: #A9A9AF;
```

## 19.1. Renk yaklaşımı

Uygulama yoğun marka rengiyle boyanmamalıdır.

Accent rengi:

```css
--accent: #0A84FF;
--accent-hover: #0077ED;
```

başlangıç referansı olabilir.

Ancak özel logo tasarımıyla birlikte marka accent'i daha sonra değişebilir.

Destructive:

```css
--danger: #E5484D;
--danger-hover: #D93D42;
```

Success:

```css
--success: #2E9B63;
```

Renkler WCAG kontrast testinden geçirilmelidir.

---

# 20. Glass token sistemi

```css
:root {
  --glass-blur-sm: 12px;
  --glass-blur-md: 20px;
  --glass-blur-lg: 28px;

  --glass-saturation: 135%;
  --glass-radius-sm: 10px;
  --glass-radius-md: 14px;
  --glass-radius-lg: 18px;
  --glass-radius-xl: 24px;

  --glass-border-width: 1px;

  --shadow-sm: 0 2px 8px rgba(0,0,0,.08);
  --shadow-md: 0 8px 28px rgba(0,0,0,.12);
  --shadow-lg: 0 18px 60px rgba(0,0,0,.16);
}
```

Not:

- Blur değerleri nihai değildir.
- Root örneği geldikten sonra optik eşleme yapılır.
- 28px blur her yerde kullanılmamalıdır.

---

# 21. Windows window material stratejisi

## Windows 11

Öncelik sırası:

1. Mica
2. CSS translucency
3. kontrollü backdrop blur

## Windows 10

Acrylic kullanılabilir ancak performans testi zorunludur.

Tauri dokümantasyonunda Acrylic ve bazı Blur kombinasyonlarının pencere resize/drag sırasında performans problemi yaratabileceği belirtilmektedir.

Bu nedenle:

- Acrylic zorunlu değildir,
- Windows 10 fallback daha opaque olabilir,
- tasarımın premium görünümü blur miktarına bağlı olmamalıdır.

---

# 22. Typography

Öneri:

- Inter Variable veya
- Geist Sans

Font uygulama içine local asset olarak paketlenmelidir.

Web font/CDN kullanılmaz.

Typography token:

```css
--font-size-xs: 12px;
--font-size-sm: 13px;
--font-size-md: 14px;
--font-size-lg: 16px;
--font-size-xl: 20px;
--font-size-2xl: 28px;
```

Örnek:

- ürün başlığı: 20–24 px / 600
- section title: 13 px / 600
- body: 14 px / 400
- table: 13–14 px
- metric: 20–24 px / 600

Aşırı bold kullanımından kaçınılır.

---

# 23. Spacing sistemi

4 px base grid.

```text
4
8
12
16
20
24
32
40
48
64
```

Rastgele:

```text
13px
17px
29px
```

gibi spacing değerleri kullanılmamalıdır.

---

# 24. Radius sistemi

```text
small control: 8–10 px
button: 10–12 px
field: 10–12 px
panel: 14–18 px
modal: 18–22 px
floating toolbar: 18–24 px
```

Her elemente dev radius verilmez.

---

# 25. İkonografi

## 25.1. Kurallar

- Emoji kesinlikle yasak.
- Unicode dingbat ikonu yasak.
- SVG zorunlu.
- Tek ikon ailesi tercih edilir.
- Stroke width optik olarak tutarlı.
- İkon + metin olan butonda ikon 16–18 px.
- Toolbar icon-only 18–20 px.
- Empty state dekorasyonu 32–48 px üstüne çıkabilir.

## 25.2. Örnek eşlemeler

| İşlem | SVG ikon anlamı |
|---|---|
| Tara | Search / Scan |
| Klasör seç | Folder Open |
| Sık kullanılan | Star |
| Çöp Kutusu | Trash / Trash2 |
| Kalıcı sil | Trash destructive |
| Ayarlar | Settings |
| Ara | Search |
| Sırala | ArrowUpDown |
| Menü | MoreHorizontal |
| Path kopyala | Copy |
| Explorer | FolderOpen |
| Yeniden tara | RefreshCw |
| İptal | X / Square |

---

# 26. Logo tasarım brief'i

Logo ürün için özel SVG olmalıdır.

## LOGO-001 — Konsept

Logo şu kavramlardan en fazla ikisini birleştirmelidir:

- Node / modül,
- klasör,
- temizleme,
- boş alan,
- katman,
- negatif alan.

Doğrudan çöp kutusu görseli ana logo yapılmamalıdır; ürün “delete app” gibi görünmemelidir.

## LOGO-002 — Stil

- geometrik,
- minimal,
- tek bakışta seçilebilir,
- küçük boyutta okunabilir,
- flat base,
- Liquid Glass içinde kullanılabilir,
- açık/koyu zeminde çalışır,
- emoji/clipart hissi yok.

## LOGO-003 — Master

Kaynak:

```text
assets/brand/logo-master.svg
```

SVG:

- viewBox düzgün,
- gereksiz metadata temizlenmiş,
- path sayısı makul,
- font dependency yok,
- stroke gerekiyorsa outline'a dönüştürülmesi değerlendirilmeli.

## LOGO-004 — Varyantlar

```text
logo.svg
logo-mark.svg
logo-wordmark.svg
logo-light.svg
logo-dark.svg
```

Wordmark ürün adı kesinleşmeden finalize edilmez.

---

# 27. Windows uygulama ikonu

Windows `.ico` içinde minimum:

- 16×16
- 24×24
- 32×32
- 40×40
- 48×48
- 64×64
- 128×128
- 256×256

bulundurulması tercih edilir.

Microsoft temel uygulama ikon seti olarak 16, 32, 48 ve 256 px boyutlarını özellikle tanımlar.

Kaynak görsel en az:

```text
1024×1024 PNG
```

ve SVG master'dan üretilmelidir.

Dosyalar:

```text
src-tauri/icons/
├── 32x32.png
├── 128x128.png
├── 128x128@2x.png
├── icon.ico
└── icon.png
```

Ek asset pipeline:

```text
assets/brand/app-icon.svg
scripts/generate-icons.*
```

ikon üretimi tekrarlanabilir olmalıdır.

Elle farklı PNG dosyaları çizilmemelidir.

---

# 28. Dil ve yerelleştirme

## LANG-001 — Arayüz dili

MVP yüzde 100 Türkçe.

Teknik olarak Türkçede doğal karşılığı olmayan terimler korunabilir:

- Node.js
- `node_modules`
- npm
- pnpm
- yarn
- Bun
- package manager
- path gerektiğinde “yol” ile desteklenebilir.

## LANG-002 — Metin tonu

- kısa,
- profesyonel,
- doğrudan,
- teknik ama anlaşılır.

Kaçınılacak:

- “Harika!”
- “Süper!”
- aşırı samimi microcopy,
- gereksiz ünlem.

## LANG-003 — Önerilen terimler

| İngilizce | Türkçe |
|---|---|
| Scan | Tara / Tarama |
| Re-scan | Yeniden Tara |
| Favorites | Sık Kullanılanlar |
| Recent | Son Kullanılanlar |
| Recycle Bin | Çöp Kutusu |
| Permanent Delete | Kalıcı Olarak Sil |
| Selected | Seçili |
| Size | Boyut |
| Modified | Son Değişiklik |
| Settings | Ayarlar |
| Search | Ara |
| Sort | Sırala |
| Cancel | Vazgeç / İptal |
| Stop Scan | Taramayı Durdur |

## LANG-004 — Kod tarafı

UI string'leri component içine dağınık hardcode edilmemelidir.

Türkçe tek dil olsa bile:

```text
locales/tr.json
```

veya typed message dictionary kullanılmalıdır.

Ama ağır i18n runtime gereksizse minimal çözüm tercih edilir.

---

# 29. Ayar saklama

Ayarlar plaintext olabilir çünkü secret içermez.

Örnek:

```json
{
  "theme": "dark-transparent",
  "reduceMotion": false,
  "favorites": [],
  "recentLocations": [],
  "lastScanPath": null,
  "sort": {
    "field": "size",
    "direction": "desc"
  }
}
```

Atomic write uygulanmalıdır:

1. temp file yaz,
2. flush,
3. rename/replace.

Bozuk config uygulamanın açılmasını engellememelidir.

Fallback default config kullanılmalıdır.

---

# 30. Window state

Uygulama:

- son pencere boyutunu,
- son konumu,
- maximize durumunu

hatırlayabilir.

Tauri window-state plugin kullanılabilir.

İlk açılış önerisi:

```text
min width: 980
min height: 640
default width: 1180
default height: 760
```

Çok küçük pencere boyutlarında layout bozulmamalıdır.

---

# 31. Responsive desktop davranışı

Bu mobil uygulama değildir.

Breakpoints:

## >= 1180 px

Tam tablo + tüm aksiyonlar.

## 900–1179 px

Bazı secondary sütunlar küçülebilir.

## < 900 px

Minimum window width nedeniyle destek sınırlıdır.

Path sütunu truncate olur.

Tooltip/full path erişilebilir kalır.

---

# 32. Accessibility

## A11Y-001

WCAG AA kontrast hedeflenir.

## A11Y-002

Keyboard navigation.

## A11Y-003

Focus visible.

## A11Y-004

Icon-only controls için `aria-label`.

## A11Y-005

Renk tek durum göstergesi değildir.

Örneğin hata yalnızca kırmızı border ile belirtilmez; metin/ikon bulunur.

## A11Y-006

Reduced motion.

## A11Y-007

Glass yüzeyde kontrast düşerse otomatik daha opaque surface kullanılmalıdır.

---

# 33. Hata mesajları

Teknik error stack kullanıcıya gösterilmez.

Örnek:

Yanlış:

```text
OsError 5: Access is denied
```

Doğru:

```text
Bu klasöre erişim izni yok.
```

Detail panel:

```text
C:\...\node_modules
Windows hata kodu: 5
```

gibi teknik bilgi isteğe bağlı gösterilebilir.

---

# 34. Error taxonomy

Rust:

```rust
enum AppError {
    InvalidPath,
    AccessDenied,
    PathNotFound,
    ScanCancelled,
    ScanFailed,
    UnsafeDeleteTarget,
    RecycleBinFailed,
    PermanentDeleteFailed,
    SettingsReadFailed,
    SettingsWriteFailed,
    PlatformUnsupported,
}
```

Frontend error mesajı enum/code üzerinden map edilir.

Backend'den ham kullanıcı metni döndürmek yerine typed error tercih edilir.

---

# 35. Risk analizi

## RISK-001 — Yanlış klasör silme

**Etki:** Kritik  
**Olasılık:** Düşük, kontrol edilmezse orta

Önlem:

- basename validation,
- canonicalization,
- scan-root verification,
- reparse kontrolü,
- destructive confirmation,
- backend guard.

## RISK-002 — Tarama sistemi yavaşlatır

**Etki:** Yüksek  
**Olasılık:** Orta

Önlem:

- bounded concurrency,
- düşük worker sayısı,
- no automatic scanning,
- cancellation,
- progress throttling.

## RISK-003 — Glass efekt GPU/resize performansını bozar

**Etki:** Orta  
**Olasılık:** Orta

Önlem:

- Mica önceliği,
- sınırlı blur surface,
- Windows 10 fallback,
- reduced transparency fallback,
- performance test.

## RISK-004 — Junction loop

**Etki:** Yüksek  
**Olasılık:** Düşük-Orta

Önlem:

- reparse point takip etme,
- visited path gerektiğinde,
- canonical path guard.

## RISK-005 — Permission error taramayı durdurur

**Etki:** Orta  
**Olasılık:** Orta

Önlem:

- per-entry error,
- scanner continue.

## RISK-006 — Çok fazla IPC event

**Etki:** Orta  
**Olasılık:** Orta

Önlem:

- batching,
- throttling.

## RISK-007 — Büyük sonuç listesi render maliyeti

**Etki:** Orta  
**Olasılık:** Düşük

Önlem:

- virtualization,
- selector state.

## RISK-008 — Kalıcı silme yanlışlıkla tetiklenir

**Etki:** Kritik  
**Olasılık:** Düşük

Önlem:

- secondary visual hierarchy,
- confirmation,
- keyboard Delete ile doğrudan çalışmama,
- safe focus default.

## RISK-009 — Theme düşük kontrast

**Etki:** Orta  
**Olasılık:** Orta

Önlem:

- token audit,
- contrast tests,
- opacity fallback.

## RISK-010 — Config corruption

**Etki:** Düşük  
**Olasılık:** Düşük

Önlem:

- atomic write,
- schema version,
- default fallback.

---

# 36. Non-functional gereksinimler

## NFR-001 — Modülerlik

Dosya 500+ satırlık mega component'lere dönüşmemelidir.

“Bir component = bir ekran” içinde tüm logic'in toplanması yasaktır.

## NFR-002 — Type safety

TypeScript:

- `strict: true`
- `any` ancak belgelenmiş istisnada.

Rust:

- panic normal control flow için kullanılmaz.

## NFR-003 — Test edilebilirlik

Scanner ve deletion UI'dan bağımsız test edilebilir olmalıdır.

## NFR-004 — Offline-first

Uygulama internet olmadan tüm çekirdek işlevleri sunmalıdır.

## NFR-005 — Deterministik davranış

Aynı filesystem snapshot'ında scan sonucu mümkün olduğunca deterministik sıralanabilir/veri modeline sahip olmalıdır.

## NFR-006 — Log

Debug build'de structured log.

Release'te:

- kişisel dosya içeriği loglanmaz,
- path logları minimum,
- telemetry yok.

## NFR-007 — Startup robustness

Bozuk preference dosyası uygulamanın açılmasını engellemez.

## NFR-008 — Long path

Windows long path senaryoları test edilmelidir.

## NFR-009 — Unicode

Türkçe, Japonca, emoji içeren klasör adı vb. Unicode path'ler teknik olarak desteklenmelidir.

UI'da emoji ikon olarak kullanılmayacaktır; path'in gerçek adında emoji varsa sansürlenmez.

---

# 37. UI component envanteri

Primitives:

```text
Button
IconButton
Checkbox
SearchField
Select
Tooltip
Popover
Dialog
ConfirmDialog
Badge
ProgressBar
Separator
Surface
GlassSurface
Skeleton
EmptyState
Toast
ContextMenu
```

Feature components:

```text
ScanLocationPicker
QuickLocations
FavoriteLocations
ScanHero
ScanProgress
ResultsToolbar
NodeModulesTable
NodeModulesRow
SelectionActionBar
DeleteConfirmation
PermanentDeleteConfirmation
ScanSummary
SettingsPanel
ThemePicker
```

Her primitive:

- theme token kullanır,
- hardcoded renk minimum,
- keyboard/focus davranışı test edilir.

---

# 38. Sonuç satırı tasarımı

Önerilen yoğunluk:

```text
yükseklik: 52–58 px
```

İçerik:

```text
[checkbox] [project]
           C:\...\project
           package manager

[size]
[modified]
[row menu]
```

Alternatif desktop table düzeni kullanılabilir.

Path:

- tek satır truncate,
- hover tooltip,
- “Yolu Kopyala”.

---

# 39. Empty / loading / error state'leri

Her ana alan en az şu state'lere sahip olmalıdır:

- idle
- loading/scanning
- success empty
- success with data
- partial error
- fatal error
- cancelled

Sadece success ekranı tasarlamak kabul edilmez.

---

# 40. Toast kullanımı

Toast yalnızca kısa sonuç geri bildirimi için.

Örnek:

```text
3 klasör Çöp Kutusu'na taşındı.
```

Kalıcı kritik error sadece toast'a bırakılmaz; detay görünmelidir.

---

# 41. Modal kuralları

Silme confirmation modal:

- merkezde,
- arka plan dim,
- glass yüzey olabilir,
- maksimum genişlik yaklaşık 440–520 px,
- path listesi çoksa scroll,
- action hierarchy net.

Kalıcı silme başlığı:

```text
Seçilen klasörler kalıcı olarak silinsin mi?
```

Alt metin:

```text
Bu işlem geri alınamaz. 3 node_modules klasörü ve yaklaşık 7,0 GB veri kalıcı olarak silinecek.
```

Butonlar:

```text
[Vazgeç] [Kalıcı Olarak Sil]
```

---

# 42. Favori konum UX'i

Quick location kartları küçük chip/button formatında.

Örnek:

```text
Masaüstü
Belgeler
Projects
Code
+ Konum Ekle
```

Favorite interaction:

- star toggle,
- context menu: yeniden adlandır / kaldır.

Path kaybolursa:

```text
Konum bulunamadı
```

olarak işaretlenir; otomatik silinmez.

---

# 43. Varsayılan exclude stratejisi

Kullanıcı seçtiği root altında tarama yaptığı için agresif global exclude listesi gerekmez.

Yine de aşağıdakiler discovery sırasında gerektiğinde atlanabilir:

- `$RECYCLE.BIN`
- `System Volume Information`

Kullanıcının açıkça seçtiği normal proje klasörleri atlanmamalıdır.

`.git` içeriğine traversal yapılması gerekmez; `.git` klasörü `node_modules` bulma açısından pratik olarak anlamsız olduğundan skip list'e alınabilir.

Aynı şekilde:

- `.svn`
- `.hg`

skip edilebilir.

Bu liste benchmark ve correctness test ile doğrulanmalıdır.

---

# 44. Package manager gösterimi

Package manager için resmi logo kullanmak zorunlu değildir.

Görsel sadelik için text badge tercih edilebilir:

```text
npm
pnpm
yarn
bun
```

Bu badge'ler monokrom/pasif olabilir.

Renkli marka logoları arayüzü gereksiz kalabalıklaştırmamalıdır.

---

# 45. Formatlama

## Boyut

```text
823 MB
1,4 GB
12,8 GB
```

Türkçe locale decimal separator:

`,`.

1024 tabanlı hesaplamada etiket tercihi:

- MB/GB kullanıcı dostu olarak kullanılabilir.

Teknik doğruluk istenirse MiB/GiB kullanılabilir; ancak kullanıcı deneyimi için standart MB/GB tercih edilmesi kabul edilebilir. Kod içinde dönüşüm açık tanımlanmalıdır.

## Tarih

Örnek:

```text
28 Ağu 2026
```

ve relative:

```text
28 gün önce
```

Birincil tabloda relative + tooltip exact date kullanılabilir.

---

# 46. Persistence schema versioning

Config:

```json
{
  "schemaVersion": 1
}
```

ile başlamalıdır.

Migration fonksiyonları ayrı olmalıdır:

```text
v1 -> v2
v2 -> v3
```

---

# 47. Geliştirme kalite kuralları

## CODE-001

God object yasak.

## CODE-002

God context yasak.

## CODE-003

God hook yasak.

`useApp()` içinde her şeyi toplamak yasaktır.

## CODE-004

UI component içinde dosya sistemi logic'i yasak.

## CODE-005

Backend command handler içinde bütün business logic'i yazmak yasak.

Command:

```rust
#[tauri::command]
async fn scan(...) { ... }
```

sadece orchestration yapmalıdır.

## CODE-006

Magic number azaltılır.

Performance ve UI constants token/config üzerinden gelir.

## CODE-007

Dead code merge edilmez.

## CODE-008

Comment “ne” değil “neden” açıklar.

## CODE-009

Public Rust API'lerde uygun doc comment.

## CODE-010

Error swallowing yasak.

---

# 48. Önerilen bağımlılık politikası

Her dependency için:

- gerçekten gerekli mi,
- bakım görüyor mu,
- binary size etkisi,
- security geçmişi,
- transit dependency sayısı

incelenir.

UI için büyük component framework tercih edilmez.

Özellikle:

- Material UI,
- Ant Design

gibi ağır ve kendine özgü görsel dili olan kitler bu premium özel tasarım için önerilmez.

Küçük headless primitive gerekirse değerlendirilebilir.

---

# 49. State yönetimi

## Scan state

```text
status
root
progress
entriesById
entryIds
errors
startedAt
finishedAt
```

## Selection state

```text
selectedIds
```

## Preferences

```text
theme
favorites
recentLocations
reduceMotion
```

Derived:

- filtered rows,
- sorted rows,
- selected bytes

store içinde sürekli duplicate tutulmamalıdır.

Memoized selector kullanılır.

---

# 50. Frontend/backend kontratı

Tauri command'leri typed wrapper üzerinden çağrılmalıdır.

Örnek frontend gateway:

```ts
export interface ScannerApi {
  startScan(request: ScanRequest): Promise<string>;
  cancelScan(scanId: string): Promise<void>;
}
```

Feature component doğrudan string command adı çağırmamalıdır.

Yanlış:

```ts
invoke("start_scan", ...)
```

her component içinde.

Doğru:

```text
lib/tauri/scanner-api.ts
```

tek adapter.

---

# 51. Scan event protokolü

Örnek event union:

```ts
type ScanEvent =
  | { type: "started"; scanId: string }
  | { type: "candidate"; entry: NodeModuleEntry }
  | { type: "measured"; id: string; sizeBytes: number }
  | { type: "progress"; progress: ScanProgress }
  | { type: "warning"; code: string; path?: string }
  | { type: "completed"; summary: ScanSummary }
  | { type: "cancelled"; summary: ScanSummary }
  | { type: "failed"; error: AppErrorDto };
```

Bu protokol versiyonlanabilir olmalıdır.

---

# 52. Test stratejisi

## 52.1. Unit test

### Scanner

- `node_modules` bulur.
- nested `node_modules` discovery skip.
- empty root.
- package.json yok.
- invalid package.json.
- npm lock.
- pnpm lock.
- yarn lock.
- bun lock.
- unicode path.
- access denied simulation.
- symlink.
- junction/reparse behavior.
- cancellation.
- size overflow edge.
- file disappearing during scan.

### Delete guard

- exact node_modules kabul.
- `node_modules-old` reddet.
- project root reddet.
- drive root reddet.
- system dir reddet.
- canonical mismatch reddet.
- reparse unsafe reddet.

### Settings

- default load.
- write/read.
- corrupt JSON fallback.
- schema migration.

## 52.2. Integration test

Geçici fixture:

```text
fixture/
├── project-a/
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│       ├── a/
│       └── b/
├── project-b/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── node_modules/
└── no-package/
    └── node_modules/
```

Expected:

- 3 entry,
- nested dependency ayrı entry değil,
- manager doğru,
- size doğru.

## 52.3. E2E

- app opens.
- choose fixture folder.
- scan.
- result appears.
- sort.
- search.
- select.
- recycle test adapter.
- permanent delete confirmation.
- theme change.
- favorite add/remove.
- restart app and preference persists.

Gerçek kullanıcı dosyaları üzerinde destructive E2E çalıştırılmaz.

## 52.4. Visual regression

Temalar:

- Beyaz
- Siyah
- Transparan
- Beyaz Transparan
- Koyu Transparan

Ekranlar:

- empty,
- scanning,
- results,
- selected action bar,
- modal,
- settings,
- error.

## 52.5. Accessibility test

- tab order,
- focus,
- labels,
- contrast,
- reduced motion.

---

# 53. Performans testleri

## PERF-TEST-001 — 10 proje

Küçük fixture.

## PERF-TEST-002 — 100 proje

Normal geliştirici arşivi.

## PERF-TEST-003 — 1000 sonuç

UI synthetic dataset.

## PERF-TEST-004 — 1 milyon directory entry simülasyonu

Scanner traversal stress.

## PERF-TEST-005 — Derin path

200+ nested directory.

## PERF-TEST-006 — Büyük node_modules

5–10 GB fixture veya generated sparse/controlled test dataset.

## PERF-TEST-007 — Cancellation

Tarama başladıktan 500 ms sonra cancel.

## PERF-TEST-008 — UI responsiveness

Tarama boyunca:

- window drag,
- scroll,
- search input

takılmamalı.

## PERF-TEST-009 — Idle soak

Uygulama 8 saat açık bırakılır.

Kontrol:

- memory leak,
- CPU creep,
- handle leak,
- disk activity.

---

# 54. Security testleri

- frontend manipüle edilerek arbitrary delete path gönder.
- `C:\` gönder.
- `%USERPROFILE%` gönder.
- `node_modules` adlı junction ile system target test et.
- scan sonrası klasörü rename edip başka şey koy.
- relative path.
- UNC path.
- `..\` traversal.
- extended-length path.
- invalid UTF.
- locked file.
- access denied.

Beklenen:

Destructive guard fail-safe davranır.

---

# 55. Kullanıcı kabul testleri

## UAT-001

Kullanıcı Projects klasörünü seçer, 15 node_modules görür.

## UAT-002

Boyuta göre sıralar.

## UAT-003

3 proje seçer.

## UAT-004

Toplam 8,2 GB gibi bilgi görür.

## UAT-005

Çöp Kutusu'na taşır.

## UAT-006

Explorer'da ilgili node_modules'ların artık olmadığını doğrular.

## UAT-007

Windows Çöp Kutusu'nda öğeleri görür.

## UAT-008

Favoriye yeni klasör ekler.

## UAT-009

Uygulamayı kapatıp açar, favori korunur.

## UAT-010

Tema seçimi korunur.

---

# 56. Kabul kriterleri

Release candidate aşağıdaki şartların tamamını sağlamalıdır.

## İşlev

- [ ] Klasör seçimi çalışıyor.
- [ ] Hızlı konumlar çalışıyor.
- [ ] Favoriler çalışıyor.
- [ ] Tarama doğru.
- [ ] Cancellation doğru.
- [ ] Boyut doğru.
- [ ] Package manager doğru.
- [ ] Search doğru.
- [ ] Sort doğru.
- [ ] Multi-select doğru.
- [ ] Çöp Kutusu çalışıyor.
- [ ] Kalıcı silme çalışıyor.
- [ ] Partial failure raporlanıyor.
- [ ] Yeniden tarama çalışıyor.

## Güvenlik

- [ ] Arbitrary path delete mümkün değil.
- [ ] Symlink/junction guard test edildi.
- [ ] System path guard test edildi.
- [ ] Kalıcı silmede confirmation var.
- [ ] Tauri capabilities minimum.
- [ ] Shell execution yok.
- [ ] Network gereksiz.

## Performans

- [ ] Idle CPU hedef içinde.
- [ ] Idle disk I/O yok.
- [ ] 8 saat soak test geçti.
- [ ] Scan UI'yı dondurmuyor.
- [ ] 1000 row UI akıcı.
- [ ] IPC event flood yok.

## UI

- [ ] Emoji yok.
- [ ] SVG ikonlar.
- [ ] Özel SVG logo.
- [ ] Windows `.ico`.
- [ ] 5 tema.
- [ ] Root Liquid Glass referansı değerlendirildi.
- [ ] Light/dark contrast testi.
- [ ] Reduced motion.

## Dil

- [ ] Kullanıcıya görünen bütün metin Türkçe.
- [ ] Teknik istisnalar kontrollü.
- [ ] İngilizce placeholder kalmamış.
- [ ] Hata mesajları Türkçe.

## Kalite

- [ ] TypeScript strict.
- [ ] God context yok.
- [ ] Scanner unit test.
- [ ] Delete guard unit test.
- [ ] Integration test.
- [ ] E2E ana akış.
- [ ] Lint temiz.
- [ ] Build warning incelemesi.
- [ ] Dependency audit.

---

# 57. CI/CD

Önerilen GitHub Actions pipeline:

```text
Pull Request
  ↓
pnpm install --frozen-lockfile
  ↓
frontend typecheck
  ↓
frontend lint
  ↓
frontend unit test
  ↓
cargo fmt --check
  ↓
cargo clippy
  ↓
cargo test
  ↓
cargo audit
  ↓
build
```

Release:

```text
tag vX.Y.Z
  ↓
Windows build
  ↓
NSIS/MSI
  ↓
checksums
  ↓
release artifact
```

Kişisel kullanımda GitHub gerekmiyorsa aynı pipeline lokal script ile karşılanabilir.

---

# 58. Sürümleme

Semantic Versioning:

```text
0.1.0 — ilk çalışan iç sürüm
0.5.0 — UI + scanner + delete feature complete
0.9.0 — release candidate
1.0.0 — stabil
```

Breaking preference schema change migration gerektirir.

---

# 59. Dağıtım

Öneri:

- NSIS installer birincil.
- MSI opsiyonel.
- portable `.exe` ileride.

Kurulum:

- admin gerektirmemesi tercih edilir,
- user-level install,
- Start Menu shortcut,
- Desktop shortcut opsiyonel,
- clean uninstall.

---

# 60. Code signing

Kişisel kullanım için zorunlu değildir.

Daha geniş dağıtım yapılırsa Windows Authenticode code signing değerlendirilmelidir.

Release artifact hash:

```text
SHA-256
```

yayınlamak iyi pratiktir.

---

# 61. Gizlilik

Uygulama kullanıcı projesinin:

- dosya içeriğini,
- package source code'unu,
- `.env` dosyalarını

okumaz.

Okunan minimum metadata:

- path,
- directory metadata,
- `package.json`,
- lockfile varlığı,
- dosya boyutu.

`package.json` sadece gerekli alanlar için parse edilir.

Ağ üzerinden hiçbir metadata gönderilmez.

---

# 62. Telemetry politikası

MVP:

```text
Telemetry = Yok
Analytics = Yok
Crash upload = Yok
```

Crash log varsa yalnızca lokalde.

---

# 63. Kaynak tüketimi politikası

Bu uygulama “cleaner” olduğu için kendisinin ağır çalışması ürün felsefesine aykırıdır.

Kesin prensipler:

- Electron kullanılmaması tercih edilir.
- no background daemon.
- no watcher.
- no periodic scan.
- no bundled database server.
- no embedded Node backend.
- no browser runtime packaging.
- no heavy UI framework.
- no unnecessary animation engine.
- no giant icon pack import.

Tree-shaking doğru olmalıdır.

---

# 64. Uygulama başlangıcı

Startup sırası:

```text
process start
  ↓
load minimal config
  ↓
create window hidden
  ↓
restore window state
  ↓
apply theme
  ↓
show window
  ↓
load favorites
```

Amaç:

- tema flash olmaması,
- yanlış boyutta pencere flash olmaması,
- beyaz ekran flash'ının azaltılması.

---

# 65. Uygulama kapanışı

Tarama sürerken kullanıcı kapatırsa:

- cancellation signal,
- worker graceful shutdown,
- config flush,
- process exit.

Silme operasyonu aktifse pencere kapanışı dikkatle ele alınmalıdır.

Aktif destructive Windows operation yarıda bilinçsizce kesilmemelidir.

---

# 66. Scan sırasında UX detayları

Tarama butonu:

```text
Tara
```

başladıktan sonra:

```text
Taramayı Durdur
```

olur.

Metrics:

```text
42 proje bulundu
16,8 GB hesaplandı
```

Boyut measurement devam ederken toplam değer “yaklaşık” veya progress state ile ifade edilir.

---

# 67. Silme progress

Çöp Kutusu/toplu delete uzun sürerse UI:

```text
3 / 12 klasör işleniyor
```

gösterebilir.

Windows native dialog açılıyorsa custom UI ile çakışmamalıdır.

Tercih edilen deneyim tek bir kontrollü progress yüzeyidir.

---

# 68. File operation teknik notu

Windows'ta modern native yaklaşım:

```text
IFileOperation
  ↓
SetOperationFlags
  ↓
DeleteItem / DeleteItems
  ↓
PerformOperations
```

Çöp Kutusu modu için recycle flag uygulanır.

`IFileOperation` STA gerektirir. Bu nedenle Rust adapter:

- dedicated STA thread,
- COM initialize,
- operation,
- COM uninitialize

şeklinde tasarlanabilir.

Bu detay UI veya genel deletion service'e sızmamalıdır.

---

# 69. Kalıcı silme teknik notu

Rust `remove_dir_all` kullanılacaksa Windows'taki:

- locked file,
- readonly attribute,
- permission error

davranışları test edilmelidir.

Alternatif olarak Windows Shell operation permanent mode değerlendirilebilir.

Temel kural:

- tek implementation detayına UI bağımlı olmaz.

---

# 70. Disk boyutu doğruluğu

MVP “logical size” gösterir.

NTFS “size on disk”:

- cluster,
- sparse file,
- compression,
- dedup

nedeniyle farklı olabilir.

UI label:

```text
Boyut
```

MVP için yeterlidir.

İleride:

```text
Diskte kapladığı alan
```

ayrı feature olabilir.

---

# 71. Tarama tekrar kullanım optimizasyonu

MVP'de cache zorunlu değildir.

Yanlış cache invalidation riskinden dolayı her explicit taramada gerçek dosya sistemi tekrar okunabilir.

İleride:

- inode/file id,
- modified time,
- cached size

ile optimizasyon değerlendirilebilir.

---

# 72. Kullanıcı davranışı kayıt etmeme

Recent locations dışında:

- hangi projeyi sildi,
- kaç GB sildi

kalıcı tarihçe olarak tutulmak zorunda değildir.

History feature MVP dışında.

---

# 73. Görsel kalite checklist

Her ekran için:

- spacing düzenli mi,
- alignment pixel-perfect mi,
- iki farklı border radius sistemi karışmış mı,
- blur gereksiz yerde mi,
- text contrast doğru mu,
- hover/focus tutarlı mı,
- icon baseline doğru mu,
- destructive action gereğinden baskın mı,
- empty space yeterli mi,
- table gereğinden yoğun mu,
- animation gereksiz mi,
- Türkçe metin taşma yapıyor mu.

---

# 74. “Apple sadeliği”nin teknik yorumu

Bu ifade şu davranışlara çevrilmelidir:

- daha az kontrol,
- daha güçlü hiyerarşi,
- geniş ama israf etmeyen boşluk,
- tek primary action,
- detayların gerektiğinde görünmesi,
- tutarlı radius,
- ince ayrımlar,
- sakin renk paleti,
- yüksek typography kalitesi,
- kontrollü motion,
- görsel dekorasyonun işleve hizmet etmesi.

“Apple gibi” görünmek adına:

- trafik ışığı kopyalamak,
- macOS titlebar taklit etmek,
- Windows davranışlarını bozmak

gereksizdir.

Windows kullanıcı beklentileri korunmalıdır.

---

# 75. Windows native davranışları

- Minimize/maximize/close güvenilir.
- Snap Layout ile çatışmamalı.
- DWM shadow korunmalı.
- DPI scaling düzgün.
- 100%, 125%, 150%, 200% test.
- Multiple monitor.
- farklı DPI monitörler arası taşıma.
- Windows light/dark system preference gerektiğinde theme başlangıcına referans olabilir.

---

# 76. Test matrisi

Minimum:

| Platform | Ölçek | Tema |
|---|---:|---|
| Windows 11 25H2/26H? güncel | 100% | Beyaz |
| Windows 11 | 125% | Koyu Transparan |
| Windows 11 | 150% | Beyaz Transparan |
| Windows 10 desteklenen sürüm | 100% | Siyah |
| Windows 10 | 125% | Transparan fallback |

Not: Release zamanındaki desteklenen Windows sürümleri tekrar doğrulanmalıdır.

---

# 77. Definition of Done

Bir feature ancak:

1. requirement ID karşılandı,
2. unit/integration test uygun,
3. error state var,
4. loading state var,
5. Türkçe metin tamam,
6. theme'lerde test,
7. keyboard kontrol,
8. performance etkisi ölçüldü,
9. lint/typecheck temiz,
10. security etkisi değerlendirildi

ise “Done” kabul edilir.

---

# 78. Geliştirme sırası

## Faz 0 — Proje iskeleti

- Tauri
- React
- TypeScript
- lint
- test
- folder structure
- theme token
- base window

## Faz 1 — Scanner core

- discovery
- skip node_modules subtree
- metadata
- cancellation
- tests

## Faz 2 — Size engine

- bounded workers
- stream
- progress
- tests
- benchmark

## Faz 3 — Core UI

- location picker
- scan
- result list
- search
- sort
- selection

## Faz 4 — Deletion

- guard
- recycle bin
- permanent
- partial report
- confirmation
- tests

## Faz 5 — Favorites/settings

- defaults
- favorites
- recent
- window state

## Faz 6 — Premium UI

- Liquid Glass
- themes
- logo
- icons
- motion
- polishing

Önemli:

Premium UI tamamen sona bırakılmamalıdır; design system Faz 0'da kurulur. Faz 6 polish ve final optik düzenleme içindir.

## Faz 7 — Hardening

- security tests
- performance tests
- long path
- junction
- permission
- 8h soak
- accessibility

## Faz 8 — Packaging

- icon pipeline
- NSIS/MSI
- version
- checksum
- release.

---

# 79. Önerilen ilk milestone

Milestone 1 hedefi:

> Kullanıcı bir klasör seçsin, gerçek `node_modules` klasörleri bulunsun ve UI'da canlı şekilde listelensin.

Bu milestone'da silme yapılmaz.

Acceptance:

- scan works,
- cancel works,
- size works,
- UI doesn't freeze,
- data model stable.

---

# 80. Önerilen ikinci milestone

> Seçim + Windows Çöp Kutusu + permanent delete guard.

Bu milestone tamamlandığında uygulama gerçek fayda üretmeye başlar.

---

# 81. Önerilen üçüncü milestone

> Final premium UI + Liquid Glass + themes + logo + installer.

---

# 82. Gelecek sürüm fikirleri

MVP sonrası ayrı değerlendirme:

- `.next`
- `dist`
- `build`
- `.turbo`
- npm/pnpm cache
- age filters
- “90 günden eski”
- workspace awareness
- repository grouping
- disk usage history
- duplicate scan roots
- tray quick scan
- portable mode

Bunların hiçbiri MVP'yi geciktirmemelidir.

---

# 83. Açık teknik kararlar

Kod yazımına başlamadan önce benchmark ile finalize edilecekler:

1. `walkdir` vs `jwalk` veya custom traversal.
2. Size worker sayısı.
3. Native `IFileOperation` doğrudan mı, ilk iterasyonda `trash` crate adapter mı.
4. Windows 10 Acrylic performansı.
5. Windows 11 Mica + transparent WebView kombinasyonu.
6. React virtualization library.
7. Final font.
8. Final marka adı ve logo sembolü.

Bu kararlar mimariyi kırmadan değiştirilebilir şekilde abstraction arkasında tutulmalıdır.

---

# 84. Araştırma temelli teknik karar notları

## Tauri

Tauri 2, Rust + sistem WebView mimarisi kullanır ve frontend'in native erişimlerini capability sistemiyle sınırlandırabilir.

## Liquid Glass

Apple güncel HIG, Liquid Glass'ı içerik katmanının tamamında değil, kontrol/navigasyon gibi fonksiyonel yüzeylerde sınırlı kullanmayı önerir. Bu ürünün performans hedefleriyle uyumludur.

## Windows pencere efektleri

Tauri, Windows 11'de Mica; Windows 10/11'de Acrylic gibi effect seçenekleri sunar. Dokümantasyon Acrylic/Blur için bazı Windows build'lerinde resize/drag performans uyarıları içerir. Bu nedenle opaque fallback zorunlu kabul edilmiştir.

## Windows Çöp Kutusu

Microsoft Shell API'de `IFileOperation` bir veya çoklu delete operation tanımlayıp `PerformOperations` ile yürütür. Çöp Kutusu davranışı native Shell operation üzerinden uygulanmalıdır.

## Windows ikonları

Microsoft masaüstü uygulama ikonları için 16×16, 32×32, 48×48 ve 256×256 boyutlarını temel set olarak belirtir; ek DPI boyutları da üretilebilir.

---

# 85. Referans kaynaklar

Aşağıdaki kaynaklar mimari ve platform kararları için incelenmiştir.

1. Tauri — Architecture  
   https://v2.tauri.app/concept/architecture/

2. Tauri — Capabilities  
   https://v2.tauri.app/security/capabilities/

3. Tauri — Dialog Plugin  
   https://v2.tauri.app/plugin/dialog/

4. Tauri — Window State Plugin  
   https://v2.tauri.app/plugin/window-state/

5. Tauri — Window Effects API  
   https://v2.tauri.app/reference/javascript/api/namespacewindow/

6. Tauri — Updater  
   https://v2.tauri.app/plugin/updater/

7. Apple Developer — Liquid Glass  
   https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass

8. Apple Human Interface Guidelines — Materials  
   https://developer.apple.com/design/human-interface-guidelines/materials

9. Apple Developer — Adopting Liquid Glass  
   https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass

10. Microsoft Learn — IFileOperation  
    https://learn.microsoft.com/en-us/windows/win32/api/shobjidl_core/nn-shobjidl_core-ifileoperation

11. Microsoft Learn — IFileOperation::DeleteItem  
    https://learn.microsoft.com/en-us/windows/win32/api/shobjidl_core/nf-shobjidl_core-ifileoperation-deleteitem

12. Microsoft Learn — Windows Icon Design Basics  
    https://learn.microsoft.com/en-us/windows/win32/uxguide/vis-icons

13. Rust trash crate  
    https://docs.rs/trash/latest/trash/

---

# 86. Kodlama ajanı için bağlayıcı özet

Bir kodlama ajanı bu projeyi geliştirirken aşağıdaki kuralları **zorunlu** kabul etmelidir:

1. Windows-first Tauri 2 + React + TypeScript + Rust.
2. UI yüzde 100 Türkçe.
3. Emoji hiçbir kullanıcı arayüzü öğesinde kullanılmaz.
4. UI ikonları profesyonel SVG.
5. Logo özel SVG.
6. Windows multi-resolution `.ico` oluşturulur.
7. Apple sadeliğinde, premium ve minimal tasarım.
8. Liquid Glass yalnızca kontrollü yüzeylerde.
9. Beş tema: Beyaz, Siyah, Transparan, Beyaz Transparan, Koyu Transparan.
10. Root'taki Liquid Glass örneği referans alınır.
11. God Context yasak.
12. God component yasak.
13. Filesystem logic frontend'de yasak.
14. Keyfi shell command yasak.
15. Otomatik tarama yasak.
16. Background watcher yasak.
17. Polling yasak.
18. Tarama explicit kullanıcı eylemiyle başlar.
19. Tarama iptal edilebilir.
20. `node_modules` bulununca discovery o klasörün içine girmez.
21. Symlink/junction default takip edilmez.
22. Boyut hesaplama bounded concurrency ile yapılır.
23. IPC update'leri throttle/batch edilir.
24. Büyük liste virtualized edilir.
25. Çöp Kutusu birincil silme yöntemidir.
26. Kalıcı silme ikinci confirmation ister.
27. Backend destructive path'i yeniden doğrular.
28. Tam `node_modules` basename guard zorunludur.
29. Sistem klasörlerine destructive işlem backend'de bloke edilir.
30. Ağ bağlantısı MVP için gereksizdir.
31. Telemetry yoktur.
32. Analytics yoktur.
33. Uygulama boşta sistem kaynağı tüketmemelidir.
34. UI performansı görsel efektlerden daha önceliklidir.
35. Tüm temalar accessibility/contrast testinden geçirilir.
36. TypeScript strict.
37. Rust error handling typed.
38. Unit + integration + E2E + performance + security testleri release öncesi zorunludur.
39. 8 saat idle soak test yapılır.
40. Kurulum çıktısı Windows için üretilir.

---

# 87. Son ürün tanımı

Node Cleaner v1 şu cümleyle tanımlanabilmelidir:

> **Seçtiğin proje klasörlerindeki `node_modules` dizinlerini hızlıca bulur, ne kadar alan kapladıklarını gösterir ve istediğin klasörleri güvenli biçimde Windows Çöp Kutusu'na taşımanı veya açık onayla kalıcı olarak silmeni sağlar.**

Ürün bunun dışında bir problem çözmeye çalışmamalıdır.

Sadelik bir eksiklik değil, ürün gereksinimidir.

Performans bir optimizasyon değil, ürün gereksinimidir.

Güvenli silme bir detay değil, ürün gereksinimidir.

Görsel kalite bir sonradan eklenen “tema” değil, ürün gereksinimidir.

Modüler mimari bir kod stili tercihi değil, ürün gereksinimidir.
