import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

// Estados disponibles para las órdenes
export const ORDER_STATUSES = {
  waiting: { label: "En Espera", color: "yellow" },
  working: { label: "En Proceso", color: "red" },
  parts: { label: "Esperando Repuestos", color: "orange" },
  completed: { label: "Completado", color: "green" },
};

// Helper para obtener el próximo displayId secuencial
const getNextDisplayId = () => {
  const lastId = parseInt(localStorage.getItem("workshop_last_id") || "0", 10);
  const nextId = lastId + 1;
  localStorage.setItem("workshop_last_id", nextId.toString());
  return nextId.toString().padStart(4, "0");
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("workshop_orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("workshop_orders", JSON.stringify(orders));
  }, [orders]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "workshop_orders") {
        const saved = localStorage.getItem("workshop_orders");
        if (saved) {
          setOrders(JSON.parse(saved));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addOrder = (orderData) => {
    const newOrder = {
      id: crypto.randomUUID(),
      displayId: getNextDisplayId(),
      status: "waiting",
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: "waiting",
          timestamp: new Date().toISOString(),
        },
      ],
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrder = (id, updates) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...updates } : order))
    );
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const changeStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;
        return {
          ...order,
          status: newStatus,
          statusHistory: [
            ...(order.statusHistory || []),
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const completeOrder = (id) => {
    changeStatus(id, "completed");
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        changeStatus,
        completeOrder,
        ORDER_STATUSES,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
