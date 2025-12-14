import { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "../components/Toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ message, type = "info", duration = 4000 }) => {
      const id = crypto.randomUUID();
      const newToast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss
      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback(
    (message, duration) => showToast({ message, type: "success", duration }),
    [showToast]
  );

  const error = useCallback(
    (message, duration) => showToast({ message, type: "error", duration }),
    [showToast]
  );

  const warning = useCallback(
    (message, duration) => showToast({ message, type: "warning", duration }),
    [showToast]
  );

  const info = useCallback(
    (message, duration) => showToast({ message, type: "info", duration }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, dismissToast, success, error, warning, info }}
    >
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
