// IndexedDB management for offline functionality
class OfflineStorage {
  private dbName = 'nabha-learning';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores for offline data
        if (!db.objectStoreNames.contains('content')) {
          const contentStore = db.createObjectStore('content', { keyPath: 'id' });
          contentStore.createIndex('category', 'categoryId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
          progressStore.createIndex('student', 'studentId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async storeContent(content: any[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['content'], 'readwrite');
    const store = transaction.objectStore('content');
    
    for (const item of content) {
      await store.put(item);
    }
  }

  async getOfflineContent(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['content'], 'readonly');
      const store = transaction.objectStore('content');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async storeProgress(progress: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['progress'], 'readwrite');
    const store = transaction.objectStore('progress');
    await store.put(progress);
  }

  async getStoredProgress(studentId: string): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      const index = store.index('student');
      const request = index.getAll(studentId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async queueSync(data: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.add({
      ...data,
      timestamp: Date.now()
    });
  }

  async getSyncQueue(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyncQueue(): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    await store.clear();
  }
}

export const offlineStorage = new OfflineStorage();

// Background sync functionality
export class BackgroundSync {
  private isOnline = navigator.onLine;
  
  constructor() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline() {
    this.isOnline = true;
    this.syncPendingData();
  }

  private handleOffline() {
    this.isOnline = false;
  }

  async syncPendingData() {
    if (!this.isOnline) return;

    try {
      const queue = await offlineStorage.getSyncQueue();
      
      for (const item of queue) {
        switch (item.type) {
          case 'progress':
            await fetch('/api/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data),
              credentials: 'include'
            });
            break;
          case 'assignment_submission':
            await fetch('/api/assignments/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.data),
              credentials: 'include'
            });
            break;
        }
      }
      
      await offlineStorage.clearSyncQueue();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  async saveProgress(progressData: any) {
    await offlineStorage.storeProgress(progressData);
    
    if (this.isOnline) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progressData),
          credentials: 'include'
        });
      } catch (error) {
        await offlineStorage.queueSync({
          type: 'progress',
          data: progressData
        });
      }
    } else {
      await offlineStorage.queueSync({
        type: 'progress',
        data: progressData
      });
    }
  }
}

export const backgroundSync = new BackgroundSync();
