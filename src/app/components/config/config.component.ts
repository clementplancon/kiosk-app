import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Import des modules Angular Material utilisés
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class ConfigComponent implements OnInit {
  configForm: FormGroup;
  filePreview: string | null = null;

  // Options pour le champ OS (liste nullable)
  osOptions = [
    { value: 'windows', viewValue: 'Windows' },
    { value: 'apple', viewValue: 'Apple' }
  ];

  // Options pour le champ "Type d'usage" (liste à choix multiple)
  usageOptions = [
    { value: 'Navigation Web', viewValue: 'Navigation Web' },
    { value: 'Bureautique', viewValue: 'Bureautique' },
    { value: 'Gaming', viewValue: 'Gaming' },
    { value: 'Montage', viewValue: 'Montage' },
    { value: 'Streaming', viewValue: 'Streaming' },
    // Vous pouvez ajouter d'autres options si nécessaire
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.configForm = this.fb.group({
      // Champs obligatoires
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      prix: [null, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      fichier: [null, Validators.required],

      // Spécifications (optionnels)
      os: [null],
      osModele: [''],
      processeur: [''],
      ram: [''],
      stockage: [''],
      tailleEcran: [''],
      carteGraphique: [''],

      // Indice de réparabilité (numérique décimal)
      indiceReparabilite: [null, Validators.pattern(/^\d+(\.\d+)?$/)],

      // Liste à choix multiple pour le type d'usage
      usage: [[]]
    });
  }

  ngOnInit(): void {
    // Charger la configuration existante
    (window as any).myAPI.loadConfig()
      .then((config: any) => {
        if (config) {
          // Pour le champ 'fichier', vous ne pouvez pas réattribuer un File via patchValue.
          // Vous pouvez, par exemple, stocker et afficher le chemin du fichier dans une autre variable ou un label.
          const { fichier, ...autresChamps } = config;
          this.configForm.patchValue(autresChamps);
          if (fichier) {
            // Affecter filePreview pour afficher la miniature
            this.filePreview = fichier;
          }
          // Vous pouvez aussi gérer l'affichage d'un message indiquant que le fichier était déjà sélectionné.
          console.log('Configuration chargée :', config);
        }
      })
      .catch((error: any) => console.error('Erreur lors du chargement de la configuration:', error));
  }

  // Gestion du changement de fichier (vidéo ou photo)
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string; // Ce sera une string en Data URL
        this.configForm.patchValue({ fichier: base64Data });
        // Stocker la Data URL pour l'affichage de la miniature
        this.filePreview = base64Data;
      };
      reader.readAsDataURL(file);
    }
  }
  
  

  // Lors de la soumission du formulaire
  onSubmit() {
    if (this.configForm.valid) {
      const configuration = this.configForm.value;
      console.log('Configuration à sauvegarder : ', configuration);
  
      // Appel à l'API Electron pour sauvegarder la configuration
      window.myAPI.saveConfig(configuration)
        .then((response) => {
          if (response.status === 'ok') {
            console.log('Configuration sauvegardée avec succès à :', response.path);
            // Vous pouvez afficher un message de confirmation à l'utilisateur
          } else {
            console.error('Erreur lors de la sauvegarde :', response.error);
            // Afficher une alerte ou un message d'erreur
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la sauvegarde via IPC :', error);
        });
    } else {
      console.log('Formulaire invalide');
      this.configForm.markAllAsTouched();
    }
  }

  displayConfig() {
    (window as any).myAPI.loadConfig()
      .then((config: any) => {
        if (config) {
          // Par exemple, naviguer vers la route '/display' qui affichera la configuration
          this.router.navigate(['/display']);
        } else {
          alert("Aucune configuration sauvegardée n'existe. Veuillez d'abord enregistrer la configuration.");
        }
      })
      .catch((error: any) => {
        console.error('Erreur lors du chargement de la configuration :', error);
        alert("Une erreur est survenue lors du chargement de la configuration.");
      });
  }
  
  // Méthode utilitaire pour déterminer si le fichier est une vidéo à partir de la Data URL
  get isVideoPreview(): boolean {
    if (!this.filePreview) return false;
    return this.filePreview.startsWith('data:video');
  }
}
