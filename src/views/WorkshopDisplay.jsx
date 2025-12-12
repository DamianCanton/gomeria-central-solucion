import { useOrder } from "../context/OrderContext";
import { OrderCard } from "../components/OrderCard";
import { motion, AnimatePresence } from "framer-motion";

export function WorkshopDisplay() {
  const { orders } = useOrder();

  // Filtrar órdenes activas y ordenar de más viejas a más nuevas (las nuevas se agregan abajo)
  const activeOrders = orders
    .filter((o) => o.status !== "completed")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="h-screen w-screen bg-black text-white p-[2vh] overflow-hidden flex flex-col">
      {/* Header compacto y responsive */}
      <header className="flex-shrink-0 border-b-4 border-red-500 pb-[1.5vh] mb-[2vh] flex justify-between items-center">
        <div>
          <h1 className="text-[4vh] font-black tracking-tight text-white leading-none">
            TALLER <span className="text-red-400">EN VIVO</span>
          </h1>
          <p className="text-[2.5vh] text-red-300 font-bold mt-[0.5vh]">
            {activeOrders.length}{" "}
            {activeOrders.length === 1 ? "Vehículo" : "Vehículos"} en Espera
          </p>
        </div>
        <div className="text-right">
          <div className="text-[5vh] font-black font-mono text-white leading-none">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-[2vh] text-neutral-400 font-bold mt-[0.5vh]">
            {new Date()
              .toLocaleDateString("es-AR", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })
              .toUpperCase()}
          </div>
        </div>
      </header>

      {/* Grid scrollable - 3 columnas, filas de altura automática */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-tv">
        <div className="grid grid-cols-3 gap-[1.5vh] auto-rows-[calc((100vh-18vh)/2)]">
          <AnimatePresence>
            {activeOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4 }}
                className="min-h-0"
              >
                <OrderCard order={order} variant="display" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {activeOrders.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-[15vh] font-black text-neutral-900 leading-none">
              ✓
            </div>
            <div className="text-[5vh] font-black text-neutral-700 mt-[2vh]">
              SIN TRABAJOS PENDIENTES
            </div>
            <div className="text-[2.5vh] text-neutral-600 font-medium mt-[1vh]">
              Todos los vehículos han sido atendidos
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
