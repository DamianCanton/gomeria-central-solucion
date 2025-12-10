import { useState, useEffect } from "react";
import {
  PlusCircle,
  Car,
  User,
  Wrench,
  CreditCard,
  Save,
  X,
} from "lucide-react";

const SERVICE_OPTIONS = [
  "Balanceado",
  "Cambio de cubiertas",
  "Alineado",
  "Frenos delanteros",
];

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-red-500 transition-colors">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:ring-2 focus:ring-red-500 transition-all"
      />
    </div>
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
    } else {
      // Reset if no initial data (cancel or finish)
      setForm({
        model: "",
        plate: "",
        clientName: "",
        selectedServices: [],
        additionalNotes: "",
      });
    }
  }, [initialData]);

  const toggleService = (service) => {
    setForm((prev) => {
      const exists = prev.selectedServices.includes(service);
      if (exists) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter((s) => s !== service),
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, service],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.model || !form.plate) return;

    const servicesStr = form.selectedServices.join(", ");
    const jobDescription = [servicesStr, form.additionalNotes]
      .filter(Boolean)
      .join(". Notas: ");

    if (!jobDescription) return;

    onSubmit({
      model: form.model,
      plate: form.plate,
      clientName: form.clientName,
      job: jobDescription,
      services: form.selectedServices,
      notes: form.additionalNotes,
    });

    if (!initialData) {
      setForm({
        model: "",
        plate: "",
        clientName: "",
        selectedServices: [],
        additionalNotes: "",
      });
    }
  };

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
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Modelo del Auto"
          icon={Car}
          placeholder="ej: Ford Focus"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
        />
        <InputField
          label="Patente / Matrícula"
          icon={CreditCard}
          placeholder="ej: AB 123 CD"
          value={form.plate}
          onChange={(e) => setForm({ ...form, plate: e.target.value })}
        />
      </div>

      <InputField
        label="Nombre del Cliente"
        icon={User}
        placeholder="Nombre y Apellido"
        value={form.clientName}
        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
      />

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">
          Trabajos Preestablecidos
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SERVICE_OPTIONS.map((service) => (
            <label
              key={service}
              className="flex items-center gap-2 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                checked={form.selectedServices.includes(service)}
                onChange={() => toggleService(service)}
              />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {service}
              </span>
            </label>
          ))}
        </div>
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
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-3.5 rounded-xl transition-all"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={`flex-1 font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white
              ${
                initialData
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                  : "bg-neutral-900 hover:bg-neutral-800 dark:bg-primary dark:hover:bg-red-700 shadow-neutral-900/20"
              }
          `}
        >
          {initialData ? <Save size={20} /> : <PlusCircle size={20} />}
          {initialData ? "Actualizar Orden" : "Crear Orden"}
        </button>
      </div>
    </form>
  );
}
