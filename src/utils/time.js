/**
 * Calcula el tiempo transcurrido desde una fecha dada
 * @param {string|Date} date - Fecha en formato ISO o Date
 * @returns {string} - Tiempo formateado (ej: "hace 5 min", "hace 2 h")
 */
export function timeAgo(date) {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "ahora";
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours} h`;
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays} días`;

  return past.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Determina si una orden es "nueva" (menos de 60 segundos)
 * @param {string|Date} createdAt - Fecha de creación
 * @returns {boolean}
 */
export function isNewOrder(createdAt) {
  if (!createdAt) return false;
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  return diffMs < 60000; // 60 segundos
}
