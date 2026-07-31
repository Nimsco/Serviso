import BrandMark from "./BrandMark";

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="text-center py-14 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 max-w-lg mx-auto shadow-xs">
    <BrandMark compact className="justify-center" />
    <h3 className="text-xl font-black text-[var(--text)] mt-6">{title}</h3>
    {description && <p className="text-[var(--text-secondary)] text-sm mt-2 leading-relaxed">{description}</p>}
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="mt-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
