declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    transaction(callback: (tx: SQLTransaction) => void): Promise<void>;
    executeSql(sql: string, params?: any[]): Promise<any>;
    execAsync(sql: string): Promise<any>;
  }

  export interface SQLiteProvider {
    databaseName: string;
    onInit?: (db: SQLiteDatabase) => Promise<void>;
  }
} 