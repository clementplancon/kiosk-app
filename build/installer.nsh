!macro customUnInstall
  ; Supprime l'entrée de démarrage de l'application dans le registre
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Kiosk App"
!macroend