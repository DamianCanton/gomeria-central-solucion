import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { clsx } from "clsx";

const variants = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    confirmBtn:
      "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    confirmBtn:
      "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20",
  },
};

export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}) {
  const style = variants[variant] || variants.danger;
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-neutral-200 dark:border-neutral-700">
              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div
                className={clsx(
                  "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4",
                  style.iconBg
                )}
              >
                <Icon size={28} className={style.iconColor} />
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={clsx(
                    "flex-1 py-3 px-4 rounded-xl font-semibold transition-all active:scale-[0.98]",
                    style.confirmBtn
                  )}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
