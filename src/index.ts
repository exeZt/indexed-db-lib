import * as types from "@/types";

export class IndexedDataStore implements types.IIndexedDataStore {
  private database =
    window?.indexedDB ||
    window?.mozIndexedDB ||
    window?.webkitIndexedDB ||
    window?.msIndexedDB as typeof window.indexedDB;
  private transaction =
    window?.IDBTransaction ||
    window?.webkitIDBTransaction ||
    window?.msIDBTransaction;
  private keyRange =
    window?.IDBKeyRange ||
    window?.webkitIDBKeyRange ||
    window?.msIDBKeyRange

  private _DataBaseList: types.DataBase = {
    DB_APPLICATION: [{ name: 'settings' }, { name: 'windows' },],
    DB_KEYS: [{ name: 'secret' }, { name: 'public' },],
    DB_USER: [{ name: 'data' }, { name: 'settings' },],
    DB_CHAT: [{ name: 'messages' }, { name: 'chats' }, { name: 'channels' },]
  };

  constructor() {
    let request: IDBOpenDBRequest;
    for (let DataKey in this._DataBaseList) {
      request = window.indexedDB.open(DataKey!);
      request.onerror = (e) => {
        console.error(`${types.IDBErrorTypes.EDB_OPEN} ${DataKey}`);
      }
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db: IDBDatabase = event.target?.result;
        db.onerror = function (e) {
          console.error(`${types.IDBErrorTypes.EDB_OPEN_DB} ${DataKey}`);
        };
        for (let i = 0; i < this._DataBaseList[DataKey].length; i++) {
          let a = this._DataBaseList[DataKey][i];
          db.createObjectStore(this._DataBaseList[DataKey][i].name, {
            keyPath: a.key_path ?? undefined,
            autoIncrement: a.ai ?? undefined
          })
        }
      }
      request.onsuccess = () => {
        console.info(`DataBase ready to use: ${DataKey}`);
      }
    }
  }

  /**
   * @param T def str : presents type to return using promise (used for update, but it's undef)
   * @param req_type  : string typeof request_type, op type to execute
   * @param db str |  using to declare database to use
   * @param object_store str | str[] : IndexedDB API objectStore
   * @param value str : Value to insert
   * @param version int : version of indexed db
   * @param query IDBValidKey | IDBKeyRange : must be defined if req_type == (remove||get), used to get|remove value by bool logic
   */
  public async request<T = string>(req_type: string, db: string, object_store: string | Array<string>, value?: string, version?: number, query?: IDBValidKey | IDBKeyRange): Promise<T | boolean | null> {
    const req: IDBRequest = (this.database as typeof this.database).open(db, version ?? undefined);

    function continueRequest(e: Event, tr: IDBRequest) {
      let db = e?.result; // should be exists
      let osRequest = req;
      let transaction_type: "readwrite" | "readonly" | "upgrade"; // typeof IndexedDB API transaction score

      tr.onerror = (e) => {
        console.error("Error occurred when tries create transaction");
      }
      
      tr.onsuccess = (e) => {
        console.error("DB Transaction created successfully");
      }

      return new Promise(async (resolve, reject) => {
        osRequest.onerror = (e) => {
          console.error("Error occurred when tries delete transaction");
          reject(false);
        }

        switch (req_type) {
          case "add": { // rwr op
            tr = db.transaction(db, "readwrite");
            const os = tr.result.objectStore(object_store);
            osRequest = os.objectStore.add(JSON.stringify(value) || JSON.stringify({ value: value }));
            resolve(true);
            break;
          }
          case "get": { // r op
            tr = db.transaction(db, "readonly");
            const os = tr.result.objectStore(object_store);
            osRequest = (os.objectStore as IDBObjectStore).get(query!);
            resolve(osRequest.result);
          }
          case "remove": {
            transaction_type = "readwrite"; // rwr operation
            tr = db.transaction(db, "readwrite");
            const os = tr.result.objectStore(object_store);
            osRequest = (os.objectStore as IDBObjectStore).delete(query!);
            osRequest.onerror = (e) => {
              console.error("Error occurred when tries delete transaction");
              reject(false);
            }
            break;
          }
          case "remove_db": { // underline to review
            let a = (db as typeof indexedDB).deleteDatabase(db as string);
            a.onerror = () => {
              console.error("Error occurred when tries delete database");
              reject(false);
            }
            a.onsuccess = () => resolve(true);
            break;
          }
          default: return new Promise<null>((r) => r(null))
        }
      })
    }

    req.onerror = (e) => {
      console.error("Error occurred when tries open database");
      return new Promise((resolve) => {
        console.error("Error occurred while initializing request: NO_REQUEST_TYPE");
        resolve(null)
      })
    };

    req.onsuccess = (e) => {
      continueRequest(e, req)
    };
  }

  get getDatabase() {
    return this.database;
  }

  get getTransaction() {
    return this.transaction;
  }

  get getKeyRange() {
    return this.keyRange;
  }
}

//@ts-expect-error // Allowed, because ns would be used in frontend && web-browser
declare global {
  interface Window {
    AppStorage: typeof IndexedDataStore
  }
}