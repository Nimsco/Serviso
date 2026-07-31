const ServiceStatusCard = ({ service, statusSaving, onToggle }) => {
  if (!service) return null;

  return (
    <div className={`border rounded-xl p-4 space-y-3 ${service.isActive ? "bg-[var(--success-bg)] border-[var(--success)]/20" : "bg-[var(--danger-bg)] border-[var(--danger)]/20"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Booking Status</p>
          <p className={`text-sm font-extrabold ${service.isActive ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
            {service.isActive ? "Active for bookings" : "Inactive for bookings"}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          disabled={statusSaving}
          className={`relative h-7 w-12 rounded-full transition duration-200 cursor-pointer disabled:opacity-60 ${service.isActive ? "bg-[var(--success)]" : "bg-[var(--text-muted)]"}`}
          aria-label={service.isActive ? "Turn service inactive" : "Turn service active"}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition duration-200 ${service.isActive ? "left-6" : "left-1"}`}></span>
        </button>
      </div>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        {service.isActive
          ? "Customers can currently view and book this service."
          : "Customers cannot view or book this service until you turn it active again."}
      </p>
    </div>
  );
};

export default ServiceStatusCard;
