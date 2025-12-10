import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Clock,
  CheckCircle,
  Trash2,
  Edit2,
  Car,
  Hash,
  FileText,
} from "lucide-react";

export function OrderCard({
  order,
  onEdit,
  onDelete,
  onComplete,
  variant = "admin",
}) {
  const isDisplay = variant === "display";

  // Format date safely
  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const baseStyles =
    "relative overflow-hidden rounded-2xl border transition-all duration-300";
  const variants = {
    admin:
      "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md p-4",
    display: "bg-neutral-900 border-4 border-neutral-600 p-10 shadow-2xl",
  };

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
    working: "bg-red-500/20 text-red-400 border-red-500",
    completed: "bg-green-500/20 text-green-400 border-green-500",
  };

  const statusBorderColors = {
    pending: "border-l-yellow-500",
    working: "border-l-red-500",
    completed: "border-l-green-500",
  };

  const statusLabels = {
    pending: "Pendiente",
    working: "En Proceso",
    completed: "Listo",
  };

  return (
    <div
      className={twMerge(
        baseStyles,
        variants[variant],
        isDisplay && `border-l-[12px] ${statusBorderColors[order.status]}`
      )}
    >
      {/* Header con hora/ID y estado */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-neutral-400 text-lg font-bold">
            <Clock size={isDisplay ? 28 : 16} />
            <span className={isDisplay ? "text-2xl" : ""}>{formattedTime}</span>
          </div>
          {/* Short ID Display */}
          <div
            className={clsx(
              "flex items-center gap-2 bg-neutral-800 rounded-lg font-mono font-bold",
              isDisplay
                ? "px-4 py-2 text-2xl text-neutral-300"
                : "px-2 py-1 text-xs text-neutral-400"
            )}
          >
            <Hash size={isDisplay ? 20 : 12} />
            {order.displayId || "N/A"}
          </div>
        </div>

        {/* Estado visible en modo display */}
        {isDisplay && (
          <div
            className={clsx(
              "px-5 py-2 rounded-xl text-2xl font-black border-2 uppercase tracking-wide",
              statusColors[order.status]
            )}
          >
            {statusLabels[order.status]}
          </div>
        )}

        {!isDisplay && (
          <div
            className={clsx(
              "px-2 py-0.5 rounded-full text-xs font-bold border",
              statusColors[order.status]
            )}
          >
            {statusLabels[order.status].toUpperCase()}
          </div>
        )}
      </div>

      {/* Patente gigante */}
      <div className="mb-6">
        <h3
          className={clsx(
            "font-black tracking-tight mb-2",
            isDisplay
              ? "text-7xl text-white bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-xl inline-block shadow-lg"
              : "text-xl text-neutral-900 dark:text-white"
          )}
        >
          {order.plate.toUpperCase()}
        </h3>
        <div
          className={clsx("flex items-center gap-3", isDisplay ? "mt-4" : "")}
        >
          <Car
            size={isDisplay ? 36 : 18}
            className={
              isDisplay
                ? "text-neutral-400"
                : "text-neutral-700 dark:text-neutral-200"
            }
          />
          <span
            className={clsx(
              "font-bold",
              isDisplay
                ? "text-4xl text-neutral-200"
                : "text-base text-neutral-700 dark:text-neutral-200"
            )}
          >
            {order.model}
          </span>
        </div>
      </div>

      {/* Servicios a realizar */}
      <div
        className={clsx(
          "rounded-xl",
          isDisplay
            ? "bg-neutral-800/80 p-8"
            : "bg-neutral-100 dark:bg-neutral-900/50 p-3"
        )}
      >
        {order.services && order.services.length > 0 ? (
          <div className="space-y-4">
            {isDisplay && (
              <div className="text-xl font-bold text-neutral-500 uppercase tracking-widest mb-4">
                Servicios a Realizar
              </div>
            )}
            <ul
              className={clsx(
                "space-y-2 font-bold",
                isDisplay
                  ? "text-4xl text-white leading-relaxed"
                  : "list-disc pl-5 text-sm text-neutral-800 dark:text-neutral-100"
              )}
            >
              {order.services.map((s) => (
                <li
                  key={s}
                  className={isDisplay ? "flex items-center gap-4" : ""}
                >
                  {isDisplay && (
                    <span className="text-red-400 text-3xl">•</span>
                  )}
                  {s}
                </li>
              ))}
            </ul>
            {order.notes && (
              <div
                className={clsx(
                  "flex items-start gap-3 border-t font-medium",
                  isDisplay
                    ? "text-2xl text-yellow-300 pt-4 mt-4 border-neutral-700"
                    : "text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-neutral-300 dark:border-neutral-700"
                )}
              >
                <FileText
                  size={isDisplay ? 28 : 14}
                  className="mt-1 flex-shrink-0"
                />
                <span>{order.notes}</span>
              </div>
            )}
          </div>
        ) : (
          // Fallback para job
          <p
            className={clsx(
              "font-bold",
              isDisplay
                ? "text-4xl text-white leading-relaxed"
                : "text-sm text-neutral-900 dark:text-white"
            )}
          >
            {order.job}
          </p>
        )}

        {/* Cliente */}
        <div
          className={clsx(
            "uppercase tracking-wider font-bold",
            isDisplay
              ? "mt-6 pt-4 border-t border-neutral-700 text-xl text-neutral-400"
              : "mt-4 text-xs text-neutral-500 dark:text-neutral-400"
          )}
        >
          Cliente: {order.clientName}
        </div>
      </div>

      {!isDisplay && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
          <button
            onClick={() => onEdit(order)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <Edit2 size={16} /> Editar
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} /> Borrar
          </button>
          <button
            onClick={() => onComplete(order.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <CheckCircle size={16} /> Listo
          </button>
        </div>
      )}
    </div>
  );
}
