import BrandMark from "./BrandMark";

const PageHeader = ({ eyebrow, title, description, image = "/hero-bg.jpg", actions, stats = [] }) => (
  <section className="relative overflow-hidden bg-[var(--bg)] border-b border-[var(--border)]">
    <div className="absolute inset-0">
      <img src={image} alt="" className="h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-[var(--bg)]/80"></div>
    </div>

    <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-3xl">
        <BrandMark compact className="mb-7" />
        {eyebrow && (
          <p className="text-[var(--primary)] font-bold text-xs uppercase tracking-wider mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-5xl font-black text-[var(--text)] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mt-4 max-w-2xl">
            {description}
          </p>
        )}
        {actions && <div className="flex flex-wrap gap-3 mt-7">{actions}</div>}
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {stats.map((item) => (
            <div key={item.label} className="bg-[var(--bg-card)]/90 border border-[var(--border)] rounded-xl p-4 shadow-xs">
              <p className="text-xl font-black text-[var(--primary)]">{item.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default PageHeader;
