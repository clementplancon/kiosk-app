import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-display',
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss'
})
export class DisplayComponent implements OnInit {
  // Variable qui contiendra la configuration chargée depuis le fichier local
  config: any = null;

  constructor() { }

  ngOnInit(): void {
    // Récupérer la configuration sauvegardée via l'API Electron
    (window as any).myAPI.loadConfig()
      .then((loadedConfig: any) => {
        if (loadedConfig) {
          this.config = loadedConfig;
          console.log('Configuration chargée :', this.config);
        } else {
          console.error('Aucune configuration sauvegardée trouvée.');
        }
      })
      .catch((error: any) => console.error('Erreur lors du chargement de la configuration :', error));
  }

  /**
   * Retourne true si le fichier semble être une vidéo
   */
  isVideo(): boolean {
    if (!this.config || !this.config.fichier) {
      return false;
    }
    // Vérifier si la Data URL indique une vidéo
    return this.config.fichier.startsWith('data:video');
  }

  get intPartPrice(): string {
    return `${Math.floor(this.config?.prix ?? 0)}€`;
  }

  get decimalPartPrice(): string {
    const stringPrice = `${this.config?.prix ?? 0}`;
    const decimalPart = stringPrice.split('.')[1];
    return decimalPart ?? '00';
  }

}