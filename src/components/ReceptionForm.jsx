import { useState, useEffect } from "react";
import {
  PlusCircle,
  Car,
  User,
  Wrench,
  CreditCard,
  Save,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";

const SERVICE_OPTIONS = [
  "Balanceado",
  "Cambio de cubiertas",
  "Alineado",
  "Frenos delanteros",
  "Frenos traseros",
  "Rotación de cubiertas",
];

const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div
        className={clsx(
          "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
          error
            ? "text-red-500"
            : "text-neutral-400 group-focus-within:text-red-500"
        )}
      >
        <Icon size={18} />
      </div>
      <input
        {...props}
        className={clsx(
          "w-full pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 transition-all",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500 dark:bg-neutral-800"
            : "border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-red-500"
        )}
      />
    </div>
    {error && (
      <p className="text-xs text-red-500 font-medium flex items-center gap-1 ml-1">
        <AlertCircle size={12} />
        {error}
      </p>
    )}
  </div>
);

export function ReceptionForm({
  onSubmit,
  initialData = null,
  onCancel = null,
}) {
  const [form, setForm] = useState({
    model: "",
    plate: "",
    clientName: "",
    selectedServices: [],
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        model: initialData.model || "",
        plate: initialData.plate || "",
        clientName: initialData.clientName || "",
        selectedServices: initialData.services || [],
        additionalNotes: initialData.notes || "",
      });
      setErrors({});
      setTouched({});
    } else {
      setForm({
        model: "",
        plate: "",
        clientName: "",
        selectedServices: [],
        additionalNotes: "",
      });
      setErrors({});
      setTouched({});
    }
  }, [initialData]);

  const validate = (formData = form) => {
    const newErrors = {};

    if (!formData.plate.trim()) {
      newErrors.plate = "La patente es obligatoria";
    } else if (formData.plate.trim().length < 6) {
      newErrors.plate = "Patente inválida (mínimo 6 caracteres)";
    }

    if (!formData.model.trim()) {
      newErrors.model = "El modelo es obligatorio";
    }

    if (
      formData.selectedServices.length === 0 &&
      !formData.additionalNotes.trim()
    ) {
      newErrors.services = "Selecciona al menos un servicio o agrega notas";
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate();
    setErrors(newErrors);
  };

  const toggleService = (service) => {
    setForm((prev) => {
      const exists = prev.selectedServices.includes(service);
      const newServices = exists
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service];

      // Clear services error if we now have services
      if (newServices.length > 0 && errors.services) {
        setErrors((prev) => {
          const { services, ...rest } = prev;
          return rest;
        });
      }

      return { ...prev, selectedServices: newServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ plate: true, model: true, clientName: true, services: true });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate async operation
    await new Promise((r) => setTimeout(r, 300));

    const servicesStr = form.selectedServices.join(", ");
    const jobDescription = [servicesStr, form.additionalNotes]
      .filter(Boolean)
      .join(". Notas: ");

    onSubmit({
      model: form.model.trim(),
      plate: form.plate.trim().toUpperCase(),
      clientName: form.clientName.trim() || "Sin nombre",
      job: jobDescription,
      services: form.selectedServices,
      notes: form.additionalNotes.trim(),
    });

    if (!initialData) {
      setForm({
        model: "",
        plate: "",
        clientName: "",
        selectedServices: [],
        additionalNotes: "",
      });
      setTouched({});
    }

    setIsSubmitting(false);
  };

  const isFormValid =
    form.plate.trim().length >= 6 &&
    form.model.trim() &&
    (form.selectedServices.length > 0 || form.additionalNotes.trim());

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 space-y-5 transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              initialData
                ? "bg-amber-100 text-amber-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {initialData ? <Save size={24} /> : <PlusCircle size={24} />}
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {initialData ? "Editar Orden" : "Nueva Orden"}
          </h2>
        </div>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Modelo del Auto *"
          icon={Car}
          placeholder="ej: Ford Focus"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          onBlur={() => handleBlur("model")}
          error={touched.model && errors.model}
        />
        <InputField
          label="Patente / Matrícula *"
          icon={CreditCard}
          placeholder="ej: AB 123 CD"
          value={form.plate}
          onChange={(e) =>
            setForm({ ...form, plate: e.target.value.toUpperCase() })
          }
          onBlur={() => handleBlur("plate")}
          error={touched.plate && errors.plate}
        />
      </div>

      <InputField
        label="Nombre del Cliente"
        icon={User}
        placeholder="Nombre y Apellido (opcional)"
        value={form.clientName}
        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
      />

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">
          Trabajos Preestablecidos *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SERVICE_OPTIONS.map((service) => (
            <label
              key={service}
              className={clsx(
                "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                form.selectedServices.includes(service)
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              )}
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-neutral-300"
                checked={form.selectedServices.includes(service)}
                onChange={() => toggleService(service)}
              />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {service}
              </span>
            </label>
          ))}
        </div>
        {touched.services && errors.services && (
          <p className="text-xs text-red-500 font-medium flex items-center gap-1 ml-1">
            <AlertCircle size={12} />
            {errors.services}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">
          Adicionales / Notas
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-4 text-neutral-400 group-focus-within:text-red-500 transition-colors">
            <Wrench size={18} />
          </div>
          <textarea
            rows={2}
            placeholder="Detalles extra..."
            value={form.additionalNotes}
            onChange={(e) =>
              setForm({ ...form, additionalNotes: e.target.value })
            }
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:ring-2 focus:ring-red-500 transition-all resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold py-3.5 rounded-xl transition-all"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={
            isSubmitting || (!isFormValid && Object.keys(touched).length > 0)
          }
          className={clsx(
            "flex-1 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-white",
            isSubmitting && "opacity-70 cursor-not-allowed",
            !isSubmitting && !isFormValid && Object.keys(touched).length > 0
              ? "bg-neutral-400 cursor-not-allowed"
              : initialData
              ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 active:scale-[0.98]"
              : "bg-neutral-900 hover:bg-neutral-800 dark:bg-red-600 dark:hover:bg-red-700 shadow-neutral-900/20 active:scale-[0.98]"
          )}
        >
          {isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : initialData ? (
            <Save size={20} />
          ) : (
            <PlusCircle size={20} />
          )}
          {isSubmitting
            ? "Guardando..."
            : initialData
            ? "Actualizar Orden"
            : "Crear Orden"}
        </button>
      </div>
    </form>
  );
}
