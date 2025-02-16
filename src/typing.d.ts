interface MyAPI {
    saveConfig: (config: any) => Promise<{ status: string; path?: string; error?: string }>;
    loadConfig: () => Promise<any>;
  }
  
  interface Window {
    myAPI: MyAPI;
  }
  