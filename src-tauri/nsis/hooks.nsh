; ============================================================
; Node Cleaner NSIS Installer/Uninstaller Hooks
; - Header image sağa hizalama (MUI_HEADERIMAGE_RIGHT)
; - Başlık / alt başlık sol hiza düzeltmesi (Control 1037/1038)
; ============================================================

; --- Header bitmap sağ tarafa ---
!ifndef MUI_HEADERIMAGE_RIGHT
  !define MUI_HEADERIMAGE_RIGHT
!endif

; --- GUI başlatma hook'ları (yazı hizalama) ---
!define MUI_CUSTOMFUNCTION_GUIINIT ncGuiInit
!define MUI_CUSTOMFUNCTION_UNGUIINIT un.ncGuiInit

; ============================================================
; Installer GUI Init — alt başlığı başlıkla aynı hizaya çeker
; ============================================================
Function ncGuiInit
  ; Title kontrolü (1037) handle al
  GetDlgItem $0 $HWNDPARENT 1037
  ; Subtitle kontrolü (1038) handle al
  GetDlgItem $1 $HWNDPARENT 1038

  ; Title'ın mevcut pozisyonunu oku (RECT: left, top, right, bottom)
  System::Call "*(i 0, i 0, i 0, i 0) p .r2"
  System::Call "user32::GetWindowRect(p r0, p r2)"
  System::Call "*$2(i .r3, i .r4, i .r5, i .r6)"
  ; r3=title_screen_left, r4=title_screen_top, r5=title_screen_right, r6=title_screen_bottom

  ; Subtitle'ın mevcut pozisyonunu oku
  System::Call "*(i 0, i 0, i 0, i 0) p .r7"
  System::Call "user32::GetWindowRect(p r1, p r7)"
  System::Call "*$7(i .r8, i .r9, i .R0, i .R1)"
  ; r8=sub_screen_left, r9=sub_screen_top, R0=sub_screen_right, R1=sub_screen_bottom

  ; Header banner'ın handle'ını al (parent of 1037)
  System::Call "user32::GetParent(p r0) p .R2"

  ; Title'ın sol konumunu banner'a göre client koordinatına çevir
  System::Call "*(i r3, i r4) p .R3"
  System::Call "user32::ScreenToClient(p R2, p R3)"
  System::Call "*$R3(i .R4, i .R5)"
  ; R4 = title_client_left

  ; Subtitle'ın konumunu banner'a göre client koordinatına çevir
  System::Call "*(i r8, i r9) p .R6"
  System::Call "user32::ScreenToClient(p R2, p R6)"
  System::Call "*$R6(i .R7, i .R8)"
  ; R7 = sub_client_left, R8 = sub_client_top

  ; Subtitle genişlik ve yüksekliğini hesapla
  IntOp $R9 $R0 - $r8  ; sub_width = sub_screen_right - sub_screen_left
  IntOp $3 $R1 - $r9    ; sub_height = sub_screen_bottom - sub_screen_top

  ; Subtitle'ı Title ile aynı sol konuma taşı (SWP_NOZORDER = 0x4)
  System::Call "user32::SetWindowPos(p r1, p 0, i R4, i R8, i R9, i $3, i 0x4)"

  ; Bellek temizliği
  System::Free $2
  System::Free $7
  System::Free $R3
  System::Free $R6
FunctionEnd

; ============================================================
; Uninstaller GUI Init — aynı hizalama mantığı
; ============================================================
Function un.ncGuiInit
  GetDlgItem $0 $HWNDPARENT 1037
  GetDlgItem $1 $HWNDPARENT 1038

  System::Call "*(i 0, i 0, i 0, i 0) p .r2"
  System::Call "user32::GetWindowRect(p r0, p r2)"
  System::Call "*$2(i .r3, i .r4, i .r5, i .r6)"

  System::Call "*(i 0, i 0, i 0, i 0) p .r7"
  System::Call "user32::GetWindowRect(p r1, p r7)"
  System::Call "*$7(i .r8, i .r9, i .R0, i .R1)"

  System::Call "user32::GetParent(p r0) p .R2"

  System::Call "*(i r3, i r4) p .R3"
  System::Call "user32::ScreenToClient(p R2, p R3)"
  System::Call "*$R3(i .R4, i .R5)"

  System::Call "*(i r8, i r9) p .R6"
  System::Call "user32::ScreenToClient(p R2, p R6)"
  System::Call "*$R6(i .R7, i .R8)"

  IntOp $R9 $R0 - $r8
  IntOp $3 $R1 - $r9

  System::Call "user32::SetWindowPos(p r1, p 0, i R4, i R8, i R9, i $3, i 0x4)"

  System::Free $2
  System::Free $7
  System::Free $R3
  System::Free $R6
FunctionEnd

; ============================================================
; Post-Install / Post-Uninstall: Windows Shell Icon Cache Flush
; ============================================================
!macro NSIS_HOOK_POSTINSTALL
  ; SHCNE_ASSOCCHANGED = 0x08000000, SHCNF_IDLIST = 0
  System::Call "shell32::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)"
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  System::Call "shell32::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)"
!macroend
