// main.js
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  // Crée la fenêtre du navigateur.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,  // Mode plein écran
    kiosk: true,  // Désactive Alt+Tab, la fermeture et autres interactions
    frame: false,  // Supprime la barre de titre
    alwaysOnTop: true,  // Garde la fenêtre au-dessus
    webPreferences: {
      nodeIntegration: false, // Désactive l'intégration de Node pour plus de sécurité
      contextIsolation: true, // Active l'isolation du contexte
      preload: path.join(__dirname, 'preload.js') // Fichier de préchargement (facultatif)
    }
  });

  // Charge l'index.html de l'application Angular.
  // Note : On suppose que le build Angular sera dans "dist/kiosk-app"
  mainWindow.loadFile(path.join(__dirname, 'dist/kiosk-app/browser/index.html'));

  // Ouvre les DevTools (optionnel, utile en développement)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Configure l'application pour se lancer au démarrage
  app.setLoginItemSettings({
    openAtLogin: true,
    // 'process.execPath' permet d'utiliser le chemin de l'exécutable de l'application
    path: process.execPath,
    // Vous pouvez ajouter des arguments si nécessaire :
    args: []
  });

  createWindow();

  app.on('activate', () => {
    // Sur macOS, recréer une fenêtre si aucune n'est ouverte
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  globalShortcut.register('Alt+Tab', () => {});
  globalShortcut.register('Control+Alt+Delete', () => {});
  globalShortcut.register('Escape', () => {});
  globalShortcut.register('Command+Q', () => {
    app.quit();
  });
  globalShortcut.register('Control+Q', () => {
      app.quit();
  });
});

app.on('window-all-closed', () => {
  // Quitte l'application sur Windows/Linux
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Chemin du fichier de configuration dans le dossier de l'utilisateur
function getConfigFilePath() {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'config.json');
}

// Handler pour sauvegarder la configuration
ipcMain.handle('save-config', async (event, config) => {
  try {
    const configPath = getConfigFilePath();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    return { status: 'ok', path: configPath };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la configuration :', error);
    return { status: 'error', error: error.message };
  }
});

// Handler pour charger la configuration
ipcMain.handle('load-config', async () => {
  try {
    const configPath = getConfigFilePath();
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors du chargement de la configuration :', error);
    return null;
  }
});
