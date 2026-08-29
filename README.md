## Indexed db usage library

### Would be used to simply communicate with indexedb

**Type specification**
```typescript
// Error enumerator
export enum IDBErrorTypes {
  EDB_OPEN = `EDB_OPEN: Error occurred while initializing database connection`,
  EDB_OPEN_DB = `Error occurred while opening database`
}

export enum DataBaseNames {
  DB_APPLICATION = 'db_application',
  DB_KEYS = 'db_keys',
  DB_USER = 'db_user',
  DB_CHAT = 'db_chat', // Chat because was allocated with old project 
}

// Store of database
export type DataBaseOStores = {
  name: string;
  ai?: boolean;
  key_path?: string | Array<string>;
  index?: { name: string; opts: any }
};
// DB and lower its alias
export type DataBase = { [k : string ]: Array<DataBaseOStores> };

type DB = DataBase; // Type Alias
// Main namespace object to use
export const DataBaseList: DB = {
  DB_APPLICATION: [{ name: 'settings' }, { name: 'windows' },],
  DB_KEYS: [{ name: 'secret' }, { name: 'public' },],
  DB_USER: [{ name: 'data' }, { name: 'settings' },],
  DB_CHAT: [{ name: 'messages' }, { name: 'chats' }, { name: 'channels' },]
};
// Pool of db's
export type DataBasePool<T = DataBaseNames> = {
  [a in keyof DataBaseNames]: IDBOpenDBRequest;
}
```
**Methods**
request : Execute request of req_type(
  "add" |
  "get" |
  "remove" |
  "update" |
  "remove_db"
) by provided params
Interface: IIndexedDataStore
```typescript
public async request<T = string>(req_type: string, db: string, object_store: string | Array<string>, value?: string, version?: number, query?: IDBValidKey | IDBKeyRange): Promise<T | boolean | null>
```

**Getters/Setters**
```typescript
get getDatabase() : IDBFactory
get getTransaction() : IDBTransaction
get getKeyRange() : IDBKeyRange
```
