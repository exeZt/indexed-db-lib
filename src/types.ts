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