/**
 * Exporta un array de órdenes a un archivo CSV
 * @param {Array} orders - Array de órdenes
 * @param {string} filename - Nombre del archivo (sin extensión)
 */
export function exportOrdersToCSV(orders, filename = "ordenes") {
  if (!orders || orders.length === 0) {
    alert("No hay órdenes para exportar");
    return;
  }

  const headers = [
    "Nro Orden de Trabajo",
    "Patente",
    "Modelo",
    "Cliente",
    "Servicios",
    "Notas",
    "Estado",
    "Fecha Creación",
  ];

  const statusLabels = {
    waiting: "En Espera",
    pending: "Pendiente",
    working: "En Proceso",
    parts: "Esperando Repuestos",
    completed: "Completado",
  };

  const rows = orders.map((order) => [
    order.displayId || "",
    order.plate || "",
    order.model || "",
    order.clientName || "",
    (order.services || []).join("; "),
    order.notes || "",
    statusLabels[order.status] || order.status,
    order.createdAt ? new Date(order.createdAt).toLocaleString("es-AR") : "",
  ]);

  // Escapar campos con comas o comillas
  const escapeField = (field) => {
    const str = String(field);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeField).join(","),
    ...rows.map((row) => row.map(escapeField).join(",")),
  ].join("\n");

  // BOM para que Excel reconozca UTF-8
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
