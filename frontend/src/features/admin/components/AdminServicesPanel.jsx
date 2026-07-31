const AdminServicesPanel = ({ services, adminDeleteService }) => (
  <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-6">
    <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Platform Services</h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div key={service._id} className="border border-[var(--border)] rounded-2xl p-5 bg-[var(--bg)]/30 space-y-4">
          <img
            src={service.image || "/logo.png"}
            alt={service.title}
            className="w-full h-32 object-cover rounded-xl border border-[var(--border)]"
          />
          <div>
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-bold text-[var(--text)] text-lg leading-tight">{service.title}</h4>
              <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                service.isActive
                  ? "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20"
                  : "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20"
              }`}>
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Provider: <span className="font-semibold">{service.provider?.name || "N/A"}</span></p>
            <p className="text-xs text-[var(--text-secondary)]">Category: <span className="font-semibold">{service.category}</span></p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]/50">
            <span className="font-black text-[var(--primary)] text-lg">Rs. {service.price}</span>
            <button
              type="button"
              onClick={() => adminDeleteService(service._id)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AdminServicesPanel;
