import { useOrder } from "../context/OrderContext";
import { OrderCard } from "../components/OrderCard";
import { motion, AnimatePresence } from "framer-motion";

export function WorkshopDisplay() {
  const { orders } = useOrder();

  const activeOrders = orders.filter((o) => o.status !== "completed");

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <header className="mb-8 border-b-4 border-primary pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-7xl font-black tracking-tight text-white">
            TALLER <span className="text-red-400">EN VIVO</span>
          </h1>
          <p className="text-4xl text-red-300 font-bold mt-2">
            {activeOrders.length}{" "}
            {activeOrders.length === 1 ? "Vehículo" : "Vehículos"} en Espera
          </p>
        </div>
        <div className="text-right">
          <div className="text-8xl font-black font-mono text-white">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-3xl text-neutral-400 font-bold mt-1">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <AnimatePresence>
          {activeOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <OrderCard order={order} variant="display" />
            </motion.div>
          ))}
        </AnimatePresence>

        {activeOrders.length === 0 && (
          <div className="col-span-full h-[50vh] flex flex-col items-center justify-center">
            <div className="text-[12rem] font-black text-neutral-900">✓</div>
            <div className="text-6xl font-black text-neutral-700 mt-4">
              SIN TRABAJOS PENDIENTES
            </div>
            <div className="text-3xl text-neutral-600 font-medium mt-2">
              Todos los vehículos han sido atendidos
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
