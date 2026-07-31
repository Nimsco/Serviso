import BrandMark from "./BrandMark";

const AuthShell = ({ title, description, sideTitle, sideItems = [], children }) => (
  <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-10 transition-colors duration-200">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-stretch">
      <aside className="hidden lg:flex relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] min-h-[620px]">
        <img src="/provider-2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[var(--bg-card)]/75"></div>
        <div className="relative p-8 flex flex-col justify-between">
          <BrandMark />
          <div>
            <p className="text-[var(--primary)] font-bold text-xs uppercase tracking-wider mb-3">Trust and operations</p>
            <h2 className="text-4xl font-black tracking-tight text-[var(--text)] leading-tight">{sideTitle}</h2>
            <div className="grid gap-3 mt-8">
              {sideItems.map((item) => (
                <div key={item.title} className="bg-[var(--bg-card)]/80 border border-[var(--border)] rounded-xl p-4">
                  <p className="font-extrabold text-[var(--text)] text-sm">{item.title}</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="bg-[var(--bg-card)] border border-[var(--border)] p-7 md:p-10 rounded-2xl shadow-lg w-full">
        <BrandMark compact className="justify-center lg:hidden mb-6" />
        <div className="text-center space-y-2 mb-7">
          <h1 className="text-3xl font-black text-[var(--text)] tracking-tight">{title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>
        {children}
      </section>
    </div>
  </div>
);

export default AuthShell;
