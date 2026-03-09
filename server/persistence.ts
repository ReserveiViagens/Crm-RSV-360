type Db = Record<string, unknown>;

let _db: Db = {};

export function mutateDb<T>(fn: (db: Db) => T): Promise<T> {
  const result = fn(_db);
  return Promise.resolve(result);
}

export function getDb(): Db {
  return _db;
}
