// Helpers pour construire INSERT / UPDATE à partir d'un body déjà validé par Zod.
// Les clés proviennent uniquement des schémas Zod (les champs inconnus sont supprimés),
// elles peuvent donc être utilisées comme noms de colonnes.

function serialize(key, value, jsonFields) {
  if (jsonFields.includes(key) && value !== null) return JSON.stringify(value)
  return value
}

function buildInsert(table, data, jsonFields = []) {
  const keys = Object.keys(data).filter((k) => data[k] !== undefined)
  const params = keys.map((k) => serialize(k, data[k], jsonFields))
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`
  return { sql, params }
}

function buildUpdate(table, data, id, jsonFields = []) {
  const keys = Object.keys(data).filter((k) => data[k] !== undefined)
  if (keys.length === 0) return null
  const params = keys.map((k) => serialize(k, data[k], jsonFields))
  params.push(id)
  const sql = `UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`
  return { sql, params }
}

module.exports = { buildInsert, buildUpdate }
