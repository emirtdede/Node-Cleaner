import { TranslationSchema } from "../types";

export const tr: TranslationSchema = {
  app: {
    title: "Node Cleaner",
    tagline: "node_modules Temizleyici",
    description: "Geliştirici disk alanını anında geri kazanın.",
  },
  header: {
    changeLocation: "Konumu Değiştir",
    chooseFolder: "Farklı Bir Konum Seç...",
    chooseFolderSub: "Gözat ve diskten klasör seçin",
    scan: "Tara",
    scanning: "Taranıyor...",
    stopScan: "Durdur",
    rescan: "Yeniden Tara",
    settings: "Ayarlar",
    defaultLocations: "VARSAYILAN KONUMLAR",
    favorites: "FAVORİLER",
    recent: "SON KONUMLAR",
    noFavorites: "Henüz favori eklenmedi.",
    folderNotSelected: "Klasör Seç...",
    startScan: "Taramayı Başlat",
  },
  quickLocations: {
    title: "Hızlı Konumlar",
    desktop: "Masaüstü",
    documents: "Belgeler",
    projects: "Projeler",
    code: "Kod (Code)",
    dev: "Geliştirme (Dev)",
    repos: "Depolar (Repos)",
    addFavorite: "Favorilere Ekle",
  },
  favorites: {
    title: "Favoriler",
    empty: "Henüz favori konum eklenmedi",
    addCurrent: "Mevcut Konumu Favorilere Ekle",
    remove: "Favorilerden Çıkar",
    rename: "Yeniden Adlandır",
    notFound: "Konum bulunamadı",
  },
  recent: {
    title: "Son Konumlar",
  },
  scan: {
    idleTitle: "Disk Alanını Geri Kazanın",
    idleSubtitle: "Projelerinizdeki node_modules klasörlerini bulun ve güvenle temizleyin.",
    selectFolderFirst: "Taramaya başlamak için yukarıdan bir klasör seçin.",
    discovering: "Projeler keşfediliyor...",
    measuring: "Boyutlar hesaplanıyor...",
    cancelling: "Tarama durduruluyor...",
    completed: "Tarama tamamlandı",
    cancelled: "Tarama durduruldu",
    failed: "Tarama başarısız oldu",
    noResultsFound: "Bu konumda hiçbir node_modules klasörü bulunamadı.",
    statsProjects: (count: number) => `${count} proje bulundu`,
    statsCleanable: (size: string) => `${size} temizlenebilir`,
    statsDirectoriesVisited: (count: number) => `${count} dizin tarandı`,
  },
  table: {
    selectAll: "Tümünü seç",
    selectRow: "Satırı seç",
    project: "Proje",
    path: "Konum",
    size: "Boyut",
    modified: "Son Değişiklik",
    packageManager: "Paket Yöneticisi",
    actions: "İşlemler",
    searchPlaceholder: "Proje adı veya yola göre filtrele... (Ctrl+F)",
    sortBy: "Sırala",
    sortSizeDesc: "Boyut (Büyükten Küçüğe)",
    sortSizeAsc: "Boyut (Küçükten Büyüğe)",
    sortDateDesc: "Son Değişiklik (Yeniden Eskiye)",
    sortDateAsc: "Son Değişiklik (Eskiden Yeniye)",
    sortNameAsc: "Proje Adı (A-Z)",
    sortNameDesc: "Proje Adı (Z-A)",
    measuring: "Hesaplanıyor...",
    unknown: "Bilinmeyen bir hata oluştu.",
    noPackageJson: "package.json yok",
    noSearchResults: "Arama kriterlerine uygun proje bulunamadı.",
    folderCount: (count: number) => `${count} Klasör`,
  },
  rowActions: {
    openInExplorer: "Dosya Gezgini'nde Aç",
    copyPath: "Yolu Kopyala",
    copyProjectRoot: "Proje Yolunu Kopyala",
    pathCopied: "Yol panoya kopyalandı",
    recycleItem: "Çöp Kutusu'na Taşı",
    permanentDeleteItem: "Kalıcı Olarak Sil",
    expand: "Genişlet",
    collapse: "Daralt",
  },
  actionBar: {
    selectedCount: (count: number) => `${count} öğe seçildi`,
    totalSize: (size: string) => `Toplam: ${size}`,
    recycleBinButton: "Çöp Kutusu'na Taşı",
    permanentDeleteButton: "Kalıcı Olarak Sil",
    clearSelection: "Seçimi Temizle",
  },
  dialog: {
    cancel: "Vazgeç",
    confirm: "Onayla",
    recycleTitle: "Seçilen Klasörler Çöp Kutusu'na Taşınsın mı?",
    recycleDescription: (count: number, size: string) => `${count} adet node_modules klasörü (${size}) Geri Dönüşüm Kutusu'na taşınacak. İstediğiniz zaman geri yükleyebilirsiniz.`,
    recycleConfirmButton: "Çöp Kutusu'na Taşı",
    permanentTitle: "Seçilen Klasörler Kalıcı Olarak Silinsin mi?",
    permanentDescription: (count: number, size: string) => `${count} adet node_modules klasörü (${size}) diskten tamamen ve geri alınamaz şekilde silinecek.`,
    permanentWarning: "DİKKAT: Bu işlem geri alınamaz! Klasörler Geri Dönüşüm Kutusu'na gönderilmeyecek.",
    permanentConfirmButton: "Kalıcı Olarak Sil",
    deletingInProgress: "Silme işlemi devam ediyor...",
    recycleSuccess: (count: number) => `${count} klasör başarıyla Geri Dönüşüm Kutusu'na gönderildi.`,
    permanentSuccess: (count: number) => `${count} klasör başarıyla kalıcı olarak silindi.`,
    partialErrorTitle: "Kısmi Silme Raporu",
    partialErrorDescription: (successCount: number, errorCount: number) => `${successCount} klasör başarıyla temizlendi, ancak ${errorCount} klasör silinemedi.`,
    lockedOrPermissionNote: "Kilitli veya yetki gerektiren dosyalar silinememiş olabilir. İlgili uygulamaları kapatıp tekrar deneyin.",
  },
  settings: {
    title: "Ayarlar",
    appearance: "Görünüm",
    theme: "Tema",
    darkThemes: "Koyu Temalar",
    lightThemes: "Açık Temalar",
    themes: {
      "dark-black": "Siyah",
      "dark-gray": "Koyu Gri",
      "dark-blue": "Koyu Mavi",
      "dark-purple": "Koyu Mor",
      "dark-green": "Koyu Yeşil",
      "dark-red": "Koyu Kırmızı",
      "dark-orange": "Koyu Turuncu",
      "dark-yellow": "Koyu Sarı",
      "light-white": "Beyaz",
      "light-gray": "Açık Gri",
      "light-blue": "Açık Mavi",
      "light-purple": "Açık Mor",
      "light-green": "Açık Yeşil",
      "light-red": "Açık Kırmızı",
      "light-orange": "Açık Turuncu",
      "light-yellow": "Açık Sarı",
    },
    language: "Dil",
    languageDesc: "Uygulama arayüzü dilini seçin (73 dil)",
    searchLanguage: "Dil ara... (73 dil)",
    systemDefault: "Sistem Dili (Varsayılan)",
    performance: "Performans ve Animasyon",
    reduceMotion: "Daha Az Hareket (Reduce Motion)",
    reduceMotionDesc: "Animasyonları ve görsel efektleri azaltarak performansı artırır.",
    favoritesManagement: "Favori Konum Yönetimi",
    noFavorites: "Kayıtlı favori konum bulunmuyor.",
    deleteFavoriteConfirm: "Bu favori konumu kaldırmak istediğinize emin misiniz?",
    favoriteRemoved: "Favori konum kaldırıldı.",
    favoriteAdded: "Favori konumlara eklendi.",
    about: "Hakkında",
    version: "Sürüm",
    platform: "Tauri v2 + React 18 + Rust",
    publisher: "Yayıncı: Vellium • © 2026 Vellium. Tüm hakları saklıdır.",
    privacyNote: "Tüm tarama ve temizlik işlemleri tamamen yerel olarak bilgisayarınızda gerçekleşir. Hiçbir veri dışarı aktarılmaz.",
    close: "Kapat",
  },
  legal: {
    sectionTitle: "Yasal Bilgiler & Kurumsal",
    back: "Geri Dön",
    velliumItemTitle: "Vellium Hakkında",
    velliumItemDesc: "Mühendislik felsefemiz, vizyonumuz ve kurumsal kimliğimiz",
    privacyItemTitle: "Gizlilik Politikası",
    privacyItemDesc: "Tamamen yerel (%100 offline), sıfır telemetri ve veri güvenliği",
    termsItemTitle: "Kullanım Koşulları & EULA",
    termsItemDesc: "Son kullanıcı lisans sözleşmesi, haklar ve kullanım kuralları",
    securityItemTitle: "Güvenlik & Sorumluluk Reddi",
    securityItemDesc: "Sistem koruması, güvenli silme mekanizmaları ve veri güvencesi",
    licensesItemTitle: "Açık Kaynak Lisansları",
    licensesItemDesc: "Kullanılan açık kaynak kütüphaneler, lisanslar ve telif bildirimleri",
    visitWebsite: "Vellium.dev'i Ziyaret Et",
    officialWebsite: "Resmi Web Sitesi: Vellium.dev",
    allRightsReserved: "© 2026 Vellium. Tüm hakları saklıdır.",
    velliumTagline: "Hassasiyet, Gizlilik ve Uzun Vadeli Güvenilirlikle Şekillenen Yazılımlar",
    velliumManifesto: [
      "Vellium; hassasiyet, gizlilik ve uzun vadeli güvenilirlikle şekillenen kalıcı yazılım sistemleri inşa eder.",
      "Günlük iş akışlarına doğal bir biçimde entegre olan, dijital sürtünmeyi azaltan ve zaman içinde rafine bir kullanıcı deneyimi sunmaya devam eden yazılım ürünleri üretiyoruz. Çalışmalarımız; masaüstü araçları, kurumsal yönetim sistemleri, akıllı okuma çalışma alanları, güvenli ticaret platformları, kamera araçları, simülasyon uygulamaları ve gelişen dijital toplulukları kapsamaktadır.",
      "Geliştirdiğimiz her ürün aynı ilkeyi benimser: Yazılım kırılgan, gürültülü veya harcanabilir hissettirmemelidir. Kararlı, özenli ve kullanıcının dikkatine, verilerine ve ortamına saygılı hissettirmelidir.",
      "Yerel öncelikli mimarilerden ve yerel masaüstü entegrasyonlarından, gizliliğe duyarlı işlemeye, güvenli yönetici sistemlerine, algoritmik doğrulamaya, makine öğrenimi destekli simülasyonlara ve kullanıcı kontrollü yapay zekâ özelliklerine kadar Vellium, yazılıma geçici bir arayüz olarak değil, mühendisliği titizlikle yapılmış bir konfor alanı olarak yaklaşır.",
      "Kaosu azaltan, kontrolü koruyan ve teknolojiyi hassas, güvenilir ve kalıcı bir değere dönüştüren sistemler inşa ediyoruz."
    ],
    privacyIntro: "Node Cleaner, en yüksek gizlilik standartlarına uygun olarak %100 yerel (local-first) prensibiyle geliştirilmiştir.",
    privacySections: [
      {
        title: "1. Sıfır Telemetri ve Sıfır Ağ İletişimi",
        content: "Node Cleaner hiçbir kullanım istatistiği, telemetri verisi, hata raporu veya analitik izleyici toplamaz. Uygulama disk taraması yaparken internete bağlanmaz veya harici sunucularla iletişim kurmaz."
      },
      {
        title: "2. Dosya Yolları ve Proje Gizliliği",
        content: "Taranan klasörler, proje isimleri, dizin yolları veya silinen paket bilgileri tamamen bilgisayarınızın RAM ve yerel depolama alanında işlenir. Bu veriler asla üçüncü şahıslarla veya bulut servisleriyle paylaşılmaz."
      },
      {
        title: "3. Yerel Yapılandırma Depolaması",
        content: "Seçtiğiniz tema, dil tercihi, pencere durumu ve eklediğiniz favori klasörler yalnızca cihazınızın yerel uygulama veri dizininde (%APPDATA%/com.vellium.nodecleaner) şifrelenmemiş yerel JSON formatında saklanır."
      },
      {
        title: "4. Kullanıcı Kontrolü",
        content: "Tüm işlemler doğrudan sizin tetiklemenizle başlar. Arka planda sessiz veya izinsiz çalışan herhangi bir arka plan servisi veya veri toplayıcı servis bulunmamaktadır."
      }
    ],
    termsIntro: "Node Cleaner uygulamasını kullanarak aşağıdaki kullanım koşullarını ve lisans hükümlerini kabul etmiş sayılırsınız.",
    termsSections: [
      {
        title: "1. Lisans Verilmesi",
        content: "Vellium, bu yazılımı kişisel veya kurumsal projelerinizdeki node_modules dizinlerini yönetmek ve temizlemek amacıyla kullanmanız için size devredilemez, münhasır olmayan bir son kullanıcı lisansı vermektedir."
      },
      {
        title: "2. Kullanım Sorumluluğu",
        content: "Taranacak dizinlerin seçimi, silinmek üzere işaretlenen paketlerin belirlenmesi ve silme onayının verilmesi tamamen kullanıcının takdirindedir. Geri Dönüşüm Kutusu'na taşıma veya kalıcı silme işlemlerinden kaynaklanan olası veri kayıplarından kullanıcı sorumludur."
      },
      {
        title: "3. Fikri Mülkiyet Hakları",
        content: "Node Cleaner'ın kaynak kodu, tasarımı, arayüzü, logoları, algoritmaları ve tüm kurumsal varlıkları Vellium'un fikri mülkiyetindedir. Telif hakları kanunları ve uluslararası anlaşmalarla korunmaktadır."
      },
      {
        title: "4. Garanti Reddi (AS IS)",
        content: "Uygulama 'olduğu gibi' (AS IS) esasıyla sunulmaktadır. Vellium, uygulamanın kesintisiz veya hatasız çalışacağına dair zımni bir garanti vermez, ancak en yüksek kararlılığı sağlamak için sürekli iyileştirmeler yapar."
      }
    ],
    securityIntro: "Node Cleaner, sistem kararlılığınızı ve veri güvenliğinizi korumak için çok katmanlı güvenlik bariyerleriyle donatılmıştır.",
    securitySections: [
      {
        title: "1. Sistem Dizinleri Koruma Kalkanı",
        content: "Uygulama, kök sürücüler (C:\\, D:\\ vb.), Windows sistem klasörleri (C:\\Windows, System32) ve Program Files gibi kritik sistem konumlarının yanlışlıkla taranmasını veya silinmesini dahili güvenlik kontrolüyle engeller."
      },
      {
        title: "2. Geri Dönüşüm Kutusu Önceliği (Güvenli Silme)",
        content: "Varsayılan temizleme modu olarak dosyalar doğrudan Windows Çöp Kutusu'na (Recycle Bin) taşınır. Bu sayede yanlışlıkla silinen bir bağımlılık klasörü istenildiği an geri yüklenebilir."
      },
      {
        title: "3. Kalıcı Silme Çift Onay Mekanizması",
        content: "Kalıcı silme (Permanent Delete) seçildiğinde, işlem öncesinde geri alınamazlık uyarısı verilir ve kullanıcının açık onayı olmadan hiçbir dosya diskten kalıcı olarak yok edilmez."
      },
      {
        title: "4. Arka Plan Süreci Bulunmaması",
        content: "Node Cleaner penceresi kapatıldığında arka planda çalışmaya devam etmez. Disk üzerinde sürekli gözetleme (watcher) veya otomatik arka plan silme işlemi gerçekleştirmez."
      }
    ],
    licensesIntro: "Node Cleaner, açık kaynak topluluğunun değerli katkılarıyla geliştirilmiştir. Kullanılan kütüphaneler ve lisansları aşağıda listelenmiştir:",
    licensesList: [
      {
        name: "Tauri",
        version: "2.2.0",
        license: "MIT / Apache-2.0",
        description: "Hafif ve güvenli yerel masaüstü uygulama çalışma zamanı ve mimarisi.",
        url: "https://tauri.app"
      },
      {
        name: "React & React DOM",
        version: "18.3.1",
        license: "MIT",
        description: "Modern, bildirimsel ve reaktif kullanıcı arayüzü kütüphanesi.",
        url: "https://react.dev"
      },
      {
        name: "Lucide React",
        version: "1.16.0",
        license: "ISC",
        description: "Temiz, tutarlı ve optimize edilmiş modern arayüz simge seti.",
        url: "https://lucide.dev"
      },
      {
        name: "Zustand",
        version: "5.0.3",
        license: "MIT",
        description: "Küçük, hızlı ve ölçeklenebilir reaktif durum yönetim kütüphanesi.",
        url: "https://zustand-demo.pmnd.rs"
      },
      {
        name: "Tokio",
        version: "1.49.0",
        license: "MIT",
        description: "Rust için asenkron I/O ve çok iş parçacıklı görev yürütme motoru.",
        url: "https://tokio.rs"
      },
      {
        name: "Trash (Rust)",
        version: "5.2.2",
        license: "MIT",
        description: "Windows Geri Dönüşüm Kutusu ile yerel ve güvenli entegrasyon.",
        url: "https://crates.io/crates/trash"
      },
      {
        name: "WalkDir",
        version: "2.5.0",
        license: "Unlicense / MIT",
        description: "Yüksek performanslı özyinelemeli dosya sistemi tarama motoru.",
        url: "https://crates.io/crates/walkdir"
      },
      {
        name: "Serde & Serde JSON",
        version: "1.0.219",
        license: "MIT / Apache-2.0",
        description: "Verimli ve tip güvenli veri serileştirme / seri durumdan çıkarma kütüphanesi.",
        url: "https://serde.rs"
      },
      {
        name: "Chrono",
        version: "0.4.44",
        license: "MIT / Apache-2.0",
        description: "Tarih ve zaman işlemleri için Rust kütüphanesi.",
        url: "https://crates.io/crates/chrono"
      },
      {
        name: "Windows Crate",
        version: "0.58.0",
        license: "MIT / Apache-2.0",
        description: "Resmi Microsoft Windows Win32 API Rust bağlayıcıları.",
        url: "https://github.com/microsoft/windows-rs"
      },
      {
        name: "Vite",
        version: "6.2.0",
        license: "MIT",
        description: "Yeni nesil ultra hızlı web ve masaüstü ön uç derleme aracı.",
        url: "https://vitejs.dev"
      },
      {
        name: "TypeScript",
        version: "5.7.3",
        license: "Apache-2.0",
        description: "Statik tip güvenliği sağlayan programlama dili ve derleyicisi.",
        url: "https://www.typescriptlang.org"
      }
    ]
  },
  errors: {
    invalidPath: "Geçersiz dizin yolu seçildi.",
    accessDenied: "Seçilen dizine erişim engellendi. İzinleri kontrol edin.",
    pathNotFound: "Belirtilen yol bulunamadı.",
    scanCancelled: "Tarama kullanıcı tarafından iptal edildi.",
    scanFailed: "Tarama sırasında bir hata oluştu.",
    unsafeDeleteTarget: "Güvenlik nedeniyle kök dizin veya sistem klasörleri silinemez.",
    recycleBinFailed: "Geri Dönüşüm Kutusu'na taşıma işlemi başarısız oldu.",
    permanentDeleteFailed: "Kalıcı silme işlemi sırasında bir hata oluştu.",
    settingsReadFailed: "Ayarlar dosyası okunamadı.",
    settingsWriteFailed: "Ayarlar kaydedilemedi.",
    openInExplorerFailed: "Dosya gezgini açılamadı.",
    copyPathFailed: "Yol panoya kopyalanamadı.",
    unknown: "Bilinmeyen bir hata oluştu.",
  },
  windowControls: {
    minimize: "Simge durumuna küçült",
    maximize: "Ekranı Kapla",
    restore: "Önceki Boyut",
    close: "Kapat",
  },
  errorBoundary: {
    title: "Uygulama Başlatılırken Bir Hata Oluştu",
    unknownError: "Bilinmeyen bir hata meydana geldi.",
    reload: "Yeniden Başlat",
  },
};

export default tr;
