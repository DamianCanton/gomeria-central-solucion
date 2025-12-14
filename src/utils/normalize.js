/**
 * Normaliza texto para búsquedas:
 * - Convierte a minúsculas
 * - Elimina tildes y diacríticos
 * @param {string} str - Texto a normalizar
 * @returns {string} - Texto normalizado
 */
export function normalizeText(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Compara si un texto contiene otro, ignorando tildes y mayúsculas
 * @param {string} text - Texto donde buscar
 * @param {string} query - Término de búsqueda
 * @returns {boolean}
 */
export function searchMatch(text, query) {
  return normalizeText(text).includes(normalizeText(query));
}
