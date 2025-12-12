# TallerFlow - Documentación Técnica

## Descripción General

**TallerFlow** es una aplicación web para la gestión de órdenes de trabajo de un taller mecánico (gomería). Permite registrar vehículos, asignar servicios, y visualizar el estado de los trabajos en tiempo real tanto para el personal de recepción como en una pantalla de TV para el taller.

---

## Stack Tecnológico

| Categoría       | Tecnología                       |
| --------------- | -------------------------------- |
| **Framework**   | React 19.2                       |
| **Bundler**     | Vite 7.2                         |
| **Estilos**     | TailwindCSS 4.1                  |
| **Routing**     | React Router DOM 7.10            |
| **Animaciones** | Framer Motion 12.23              |
| **Iconos**      | Lucide React                     |
| **Estado**      | React Context API + LocalStorage |
| **Linting**     | ESLint 9                         |

---

## Estructura del Proyecto

```
src/
├── App.jsx                 # Definición de rutas
├── main.jsx                # Punto de entrada, providers
├── index.css               # Estilos globales (Tailwind)
├── context/
│   └── OrderContext.jsx    # Manejo de estado global de órdenes
├── components/
│   ├── OrderCard.jsx       # Tarjeta visual de orden
│   └── ReceptionForm.jsx   # Formulario de creación/edición
└── views/
    ├── ReceptionDashboard.jsx  # Panel principal de recepción
    └── WorkshopDisplay.jsx     # Vista para TV del taller
```

---

## Arquitectura de Estado

### OrderContext

El estado de las órdenes se maneja mediante **React Context API** con persistencia en **LocalStorage**.

```jsx
// Estructura de una orden
{
  id: string,           // UUID único
  displayId: string,    // ID corto de 4 dígitos (ej: #4921)
  status: string,       // 'pending' | 'completed'
  createdAt: string,    // ISO date
  model: string,        // Modelo del vehículo
  plate: string,        // Patente
  clientName: string,   // Nombre del cliente
  job: string,          // Descripción del trabajo
  services: string[],   // Servicios seleccionados
  notes: string         // Notas adicionales
}
```

### Sincronización entre pestañas

Se utiliza el evento nativo `storage` para sincronizar cambios entre pestañas del navegador (útil para la vista TV).

---

## Rutas

| Ruta  | Componente         | Descripción                      |
| ----- | ------------------ | -------------------------------- |
| `/`   | ReceptionDashboard | Panel de recepción y gestión     |
| `/tv` | WorkshopDisplay    | Vista de pantalla para el taller |

---

## Características Principales

### Panel de Recepción (`/`)

- Formulario para crear y editar órdenes
- Búsqueda por patente o nombre de cliente
- Listado de órdenes activas y completadas
- Contador de autos en espera
- Modo oscuro/claro

### Vista TV (`/tv`)

- Visualización de 6 órdenes activas
- Diseño optimizado para pantallas grandes
- Actualización automática vía LocalStorage sync
- Muestra ID de orden, patente, y servicios

---

## Servicios Predefinidos

Los servicios disponibles están definidos en `ReceptionForm.jsx`:

- Balanceado
- Cambio de cubiertas
- Alineado
- Frenos delanteros

---

## Despliegue

### Desarrollo

```bash
npm install
npm run dev
```

La app corre en `http://localhost:5173`

### Producción

```bash
npm run build
npm run preview
```

### Vercel

El proyecto incluye `vercel.json` para manejar el routing SPA:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Persistencia de Datos

Actualmente los datos se almacenan únicamente en **LocalStorage** del navegador bajo la clave `workshop_orders`. No hay backend ni base de datos.

> ⚠️ **Limitación**: Los datos se pierden si se limpia el almacenamiento del navegador.

---

## Theming

El modo oscuro se implementa mediante:

1. Clase `dark` en el elemento `<html>`
2. Variantes de Tailwind `dark:`
3. Persistencia en `localStorage.theme`
