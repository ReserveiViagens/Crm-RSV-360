import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

type Db = Record<string, unknown>;

let _db: Db = {};

function loadFromDisk(): void {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      _db = JSON.parse(raw);
    }
  } catch (err) {
    console.error("[persistence] Failed to load from disk:", err);
    _db = {};
  }
}

function saveToDisk(): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(_db, null, 2), "utf-8");
  } catch (err) {
    console.error("[persistence] Failed to save to disk:", err);
  }
}

loadFromDisk();

export function mutateDb<T>(fn: (db: Db) => T): Promise<T> {
  const result = fn(_db);
  saveToDisk();
  return Promise.resolve(result);
}

export function getDb(): Db {
  return _db;
}
