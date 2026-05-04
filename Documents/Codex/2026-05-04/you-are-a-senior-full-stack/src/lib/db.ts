import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = process.env.DATABASE_URL?.replace("sqlite:", "") ?? path.join(process.cwd(), "data", "blunder.sqlite");

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    migrate(db);
  }
  return db;
}

export function json<T>(value: string | null): T {
  return value ? (JSON.parse(value) as T) : ({} as T);
}

function migrate(database: Database.Database) {
  database.exec("CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");
  const migrationDir = path.join(process.cwd(), "migrations");
  if (!fs.existsSync(migrationDir)) return;
  const applied = new Set(
    (database.prepare("SELECT id FROM schema_migrations").all() as { id: string }[]).map((row) => row.id)
  );
  const files = fs.readdirSync(migrationDir).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");
    database.transaction(() => {
      database.exec(sql);
      database.prepare("INSERT INTO schema_migrations (id) VALUES (?)").run(file);
    })();
  }
}
