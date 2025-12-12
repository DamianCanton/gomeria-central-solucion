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
    display:
      "bg-neutral-900 border-4 border-neutral-600 p-[1.5vh] shadow-2xl h-full flex flex-col",
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
        isDisplay && `border-l-[8px] ${statusBorderColors[order.status]}`
      )}
    >
      {/* Header con hora/ID y estado */}
      <div className="flex justify-between items-center mb-[0.8vh] flex-shrink-0">
        <div className="flex items-center gap-[0.8vh]">
          <div className="flex items-center gap-[0.5vh] text-neutral-400 font-bold">
            <Clock
              size={isDisplay ? "2vh" : 16}
              className={isDisplay ? "w-[2vh] h-[2vh]" : ""}
            />
            <span className={isDisplay ? "text-[1.8vh]" : ""}>
              {formattedTime}
            </span>
          </div>
          {/* Short ID Display */}
          <div
            className={clsx(
              "flex items-center gap-[0.5vh] bg-neutral-800 rounded-lg font-mono font-bold",
              isDisplay
                ? "px-[1vh] py-[0.5vh] text-[1.6vh] text-neutral-300"
                : "px-2 py-1 text-xs text-neutral-400"
            )}
          >
            <Hash
              size={isDisplay ? "1.5vh" : 12}
              className={isDisplay ? "w-[1.5vh] h-[1.5vh]" : ""}
            />
            {order.displayId || "N/A"}
          </div>
        </div>

        {/* Estado visible en modo display */}
        {isDisplay && (
          <div
            className={clsx(
              "px-[1.2vh] py-[0.5vh] rounded-lg text-[1.4vh] font-black border-2 uppercase tracking-wide",
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
      <div className={isDisplay ? "mb-[1vh] flex-shrink-0" : "mb-6"}>
        <h3
          className={clsx(
            "font-black tracking-tight",
            isDisplay
              ? "text-[4vh] text-white bg-gradient-to-r from-red-500 to-red-600 px-[1.2vh] py-[0.6vh] rounded-lg inline-block shadow-lg leading-tight"
              : "text-xl text-neutral-900 dark:text-white mb-2"
          )}
        >
          {order.plate.toUpperCase()}
        </h3>
        <div
          className={clsx(
            "flex items-center",
            isDisplay ? "gap-[0.8vh] mt-[0.8vh]" : "gap-3"
          )}
        >
          <Car
            size={isDisplay ? "2.5vh" : 18}
            className={clsx(
              isDisplay
                ? "text-neutral-400 w-[2.5vh] h-[2.5vh]"
                : "text-neutral-700 dark:text-neutral-200"
            )}
          />
          <span
            className={clsx(
              "font-bold",
              isDisplay
                ? "text-[2.2vh] text-neutral-200"
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
            ? "bg-neutral-800/80 p-[1.2vh] flex-1 min-h-0 overflow-hidden flex flex-col"
            : "bg-neutral-100 dark:bg-neutral-900/50 p-3"
        )}
      >
        {order.services && order.services.length > 0 ? (
          <div
            className={isDisplay ? "flex flex-col min-h-0 flex-1" : "space-y-4"}
          >
            {isDisplay && (
              <div className="text-[1.2vh] font-bold text-neutral-500 uppercase tracking-widest mb-[0.6vh] flex-shrink-0">
                Servicios a Realizar
              </div>
            )}
            <ul
              className={clsx(
                "font-bold",
                isDisplay
                  ? "text-[1.8vh] text-white leading-snug space-y-[0.4vh] overflow-auto flex-1 min-h-0"
                  : "list-disc pl-5 text-sm text-neutral-800 dark:text-neutral-100 space-y-2"
              )}
            >
              {order.services.slice(0, isDisplay ? 4 : undefined).map((s) => (
                <li
                  key={s}
                  className={isDisplay ? "flex items-center gap-[0.6vh]" : ""}
                >
                  {isDisplay && (
                    <span className="text-red-400 text-[1.6vh]">•</span>
                  )}
                  {s}
                </li>
              ))}
              {isDisplay && order.services.length > 4 && (
                <li className="text-neutral-500 text-[1.4vh]">
                  +{order.services.length - 4} más...
                </li>
              )}
            </ul>
            {order.notes && (
              <div
                className={clsx(
                  "flex items-start border-t font-medium flex-shrink-0",
                  isDisplay
                    ? "text-[1.4vh] text-yellow-300 pt-[0.6vh] mt-[0.6vh] border-neutral-700 gap-[0.5vh]"
                    : "text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-neutral-300 dark:border-neutral-700 gap-3"
                )}
              >
                <FileText
                  size={isDisplay ? "1.4vh" : 14}
                  className={clsx(
                    "mt-1 flex-shrink-0",
                    isDisplay && "w-[1.4vh] h-[1.4vh]"
                  )}
                />
                <span className={isDisplay ? "line-clamp-1" : ""}>
                  {order.notes}
                </span>
              </div>
            )}
          </div>
        ) : (
          // Fallback para job
          <p
            className={clsx(
              "font-bold",
              isDisplay
                ? "text-[2vh] text-white leading-snug"
                : "text-sm text-neutral-900 dark:text-white"
            )}
          >
            {order.job}
          </p>
        )}

        {/* Cliente */}
        <div
          className={clsx(
            "uppercase tracking-wider font-bold flex-shrink-0",
            isDisplay
              ? "mt-[0.8vh] pt-[0.6vh] border-t border-neutral-700 text-[1.2vh] text-neutral-400"
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
