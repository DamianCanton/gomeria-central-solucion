import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { clsx } from "clsx";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-blue-600 text-white",
};

export function Toast({ message, type = "info", onDismiss }) {
  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg pointer-events-auto min-w-[280px] max-w-[400px]",
        styles[type]
      )}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="flex-1 font-medium text-sm">{message}</span>
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
