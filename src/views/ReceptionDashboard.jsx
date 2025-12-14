import { useState, useEffect } from "react";
import { useOrder, ORDER_STATUSES } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import { OrderCard } from "../components/OrderCard";
import { ReceptionForm } from "../components/ReceptionForm";
import { ConfirmModal } from "../components/ConfirmModal";
import { Search, Monitor, Sun, Moon, Download, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { searchMatch } from "../utils/normalize";
import { exportOrdersToCSV } from "../utils/exportCSV";
import { clsx } from "clsx";

export function ReceptionDashboard() {
  const {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    completeOrder,
    changeStatus,
  } = useOrder();
  const toast = useToast();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // Apply theme to HTML element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Filter orders with normalized search
  const filterOrder = (order) => {
    const matchesSearch =
      searchMatch(order.plate, filter) ||
      searchMatch(order.clientName, filter) ||
      searchMatch(order.model, filter);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  };

  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && filterOrder(o)
  );

  const completedOrders = orders.filter(
    (o) => o.status === "completed" && filterOrder(o)
  );

  const handleCreateOrUpdate = (orderData) => {
    if (editingId) {
      updateOrder(editingId, orderData);
      setEditingId(null);
      toast.success("Orden actualizada correctamente");
    } else {
      const newOrder = addOrder(orderData);
      toast.success(`Orden #${newOrder.displayId} creada`);
    }
  };

  const handleEditClick = (order) => {
    setEditingId(order.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id);
      toast.info(`Orden #${orderToDelete.displayId} eliminada`);
    }
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const handleCompleteOrder = (orderId) => {
    completeOrder(orderId);
    const order = orders.find((o) => o.id === orderId);
    toast.success(`Orden #${order?.displayId} marcada como completada`);
  };

  const handleChangeStatus = (orderId, newStatus) => {
    changeStatus(orderId, newStatus);
    const order = orders.find((o) => o.id === orderId);
    const statusLabel = ORDER_STATUSES[newStatus]?.label || newStatus;
    toast.info(`Orden #${order?.displayId}: ${statusLabel}`);
  };

  const handleExportCSV = () => {
    const ordersToExport =
      statusFilter === "all"
        ? orders
        : orders.filter((o) => o.status === statusFilter);
    exportOrdersToCSV(ordersToExport, "ordenes_taller");
    toast.success("Órdenes exportadas a CSV");
  };

  const editingOrder = orders.find((o) => o.id === editingId);

  const statusFilterOptions = [
    { value: "all", label: "Todos", color: "neutral" },
    { value: "waiting", label: "En Espera", color: "yellow" },
    { value: "working", label: "En Proceso", color: "red" },
    { value: "parts", label: "Esperando Repuestos", color: "orange" },
    { value: "completed", label: "Completados", color: "green" },
  ];

  const getChipStyles = (value, color) => {
    const isActive = statusFilter === value;
    const colors = {
      neutral: isActive
        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700",
      yellow: isActive
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
      red: isActive
        ? "bg-red-500 text-white"
        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50",
      orange: isActive
        ? "bg-orange-500 text-white"
        : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50",
      green: isActive
        ? "bg-green-500 text-white"
        : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
    };
    return colors[color] || colors.neutral;
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black p-6 font-sans transition-colors duration-500">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter">
            Taller<span className="text-red-500">Flow</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Panel de Recepción
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
            title="Exportar a CSV"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 text-neutral-700 dark:text-yellow-300 font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-neutral-300 dark:border-neutral-600"
            title={
              theme === "light" ? "Activar Modo Oscuro" : "Activar Modo Claro"
            }
            aria-label="Cambiar tema"
          >
            <span className="transition-transform duration-300">
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </span>
            <span className="text-sm hidden sm:inline">
              {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
            </span>
          </button>
          <Link
            to="/tv"
            target="_blank"
            className="flex items-center gap-2 bg-neutral-900 dark:bg-red-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-neutral-800 dark:hover:bg-red-700 transition shadow-lg shadow-neutral-900/20"
          >
            <Monitor size={20} />
            Abrir TV Taller
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 space-y-6">
          <ReceptionForm
            onSubmit={handleCreateOrUpdate}
            initialData={editingOrder}
            onCancel={handleCancelEdit}
          />

          <div className="bg-neutral-900 dark:bg-red-600 rounded-2xl p-6 text-white shadow-lg shadow-neutral-900/20">
            <h3 className="font-bold text-lg mb-2">Autos en Espera</h3>
            <p className="text-5xl font-black">{activeOrders.length}</p>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por Patente, Cliente o Modelo..."
              className="w-full pl-12 pr-12 py-4 rounded-xl border-none shadow-sm text-neutral-900 font-medium focus:ring-2 focus:ring-red-500 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            {statusFilterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-sm font-semibold transition-all",
                  getChipStyles(option.value, option.color)
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              En Proceso{" "}
              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                {activeOrders.length}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto items-start">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  variant="admin"
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onComplete={handleCompleteOrder}
                  onChangeStatus={handleChangeStatus}
                />
              ))}
              {activeOrders.length === 0 && (
                <div className="col-span-full py-12 text-center text-neutral-400 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                  {filter || statusFilter !== "all"
                    ? "No hay órdenes que coincidan con la búsqueda."
                    : "No hay autos en espera. Agrega uno nuevo."}
                </div>
              )}
            </div>
          </div>

          {completedOrders.length > 0 && (
            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                Completados{" "}
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                  {completedOrders.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedOrders.slice(0, 6).map((order) => (
                  <div
                    key={order.id}
                    className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                  >
                    <OrderCard
                      order={order}
                      variant="admin"
                      onDelete={handleDeleteClick}
                      onEdit={handleEditClick}
                      onComplete={() => {}}
                      onChangeStatus={handleChangeStatus}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="¿Eliminar esta orden?"
        message={
          orderToDelete
            ? `La orden #${orderToDelete.displayId} (${orderToDelete.plate}) será eliminada permanentemente.`
            : "Esta acción no se puede deshacer."
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
