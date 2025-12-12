# Tareas Pendientes - TallerFlow

## Prioridad Alta

- [ ] **Backend y Base de Datos**: Implementar un backend (Node.js/Express o similar) con base de datos (PostgreSQL/MongoDB) para persistir órdenes de forma permanente.
- [ ] **Autenticación**: Agregar sistema de login para el personal de recepción.
- [ ] **Impresión de Tickets**: Generar tickets imprimibles para entregar al cliente.

## Prioridad Media

- [ ] **Más Servicios**: Permitir agregar/editar servicios desde la UI (actualmente están hardcodeados).
- [ ] **Historial de Órdenes**: Vista para consultar órdenes anteriores por fecha o cliente.
- [ ] **Estados Intermedios**: Agregar estados como "en progreso", "esperando repuestos", etc.
- [ ] **Notificaciones**: Alertas cuando una orden cambia de estado.
- [ ] **Dashboard de Estadísticas**: Métricas de órdenes completadas, tiempos promedio, etc.

## Prioridad Baja

- [ ] **PWA**: Convertir la app en Progressive Web App para uso offline.
- [ ] **Responsive TV View**: Mejorar adaptación de la vista TV para diferentes resoluciones.
- [ ] **Exportar Datos**: Opción para exportar órdenes a CSV/Excel.
- [ ] **Integración WhatsApp**: Enviar notificaciones al cliente por WhatsApp.

## Bugs Conocidos

- [ ] El `displayId` puede repetirse ya que es aleatorio (considerar usar un contador secuencial).
- [ ] La búsqueda no funciona con tildes (ej: buscar "José" no encuentra "Jose").

## Mejoras de UX

- [ ] Animaciones de transición al agregar/eliminar órdenes.
- [ ] Confirmación antes de eliminar una orden.
- [ ] Indicador visual de orden recién agregada.
