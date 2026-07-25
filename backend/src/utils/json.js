// Safe JSON parse/stringify helpers for SQLite text columns that store
// arrays/objects (Prisma + SQLite has no native JSON column type).
function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function safeStringify(value) {
  return JSON.stringify(value ?? null);
}

module.exports = { safeParse, safeStringify };
