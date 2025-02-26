interface MyAPI {
    saveConfig: (config: any) => Promise<{ status: string; path?: string; error?: string }>;
    loadConfig: () => Promise<any>;
    onSystemResumed: (callback: () => void) => void;
  }
  
  interface Window {
    myAPI: MyAPI;
  }
  