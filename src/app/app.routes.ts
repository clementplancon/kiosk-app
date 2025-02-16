import { Routes } from '@angular/router';
import { ConfigComponent } from './components/config/config.component';
import { DisplayComponent } from './components/display/display.component';

export const routes: Routes = [
    // Route par défaut qui affiche le composant de configuration
    { path: '', component: ConfigComponent },
    { path: 'display', component: DisplayComponent },
    // Redirige toute route inconnue vers la configuration
    { path: '**', redirectTo: '' }
];
