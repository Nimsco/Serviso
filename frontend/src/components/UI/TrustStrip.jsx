const defaultItems = [
  { value: "Verified", label: "Provider documents reviewed" },
  { value: "Secure", label: "Stripe checkout flow" },
  { value: "7 days", label: "Clear booking window" },
  { value: "Local", label: "Nepal-focused service network" },
];

const TrustStrip = ({ items = defaultItems }) => (
  <section className="bg-[var(--bg-card)] border-y border-[var(--border)]">
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className="border border-[var(--border)] bg-[var(--bg)]/50 rounded-xl p-4">
          <p className="text-lg font-black text-[var(--primary)]">{item.value}</p>
          <p className="text-xs text-[var(--text-secondary)] font-semibold mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default TrustStrip;
