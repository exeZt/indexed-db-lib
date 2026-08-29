export type request_type =
  "add" |
  "get" |
  "remove" |
  "update" |
  "remove_db"

export interface IIndexedDataStore {
  request<T = string>(req_type: request_type, 
    db: string | Array<string>, object_store: string | Array<string>,
    value?: string, version?: number,
    query?: IDBValidKey | IDBKeyRange): Promise<T | boolean | null>
}

export enum IDBErrorTypes {
    EDB_OPEN = `EDB_OPEN: Error occurred while initializing database connection`,
    EDB_OPEN_DB = `Error occurred while opening database`
  }

  export enum DataBaseNames {
    DB_APPLICATION = 'db_application',
    DB_KEYS = 'db_keys',
    DB_USER = 'db_user',
    DB_CHAT = 'db_chat',
  }

  export type DataBaseOStores = {
    name: string;
    ai?: boolean;
    key_path?: string | Array<string>;
    index?: { name: string; opts: any }
  };

  export type DataBase = { [k : string ]: Array<DataBaseOStores> };

  type DB = DataBase; // Type Alias


  export type DataBasePool<T = DataBaseNames> = {
    [a in keyof DataBaseNames]: IDBOpenDBRequest;
  }