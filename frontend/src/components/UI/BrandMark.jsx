const BrandMark = ({ compact = false, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <img
      src="/logo.png"
      alt="Serviso"
      className={`${compact ? "h-9 w-9" : "h-12 w-12"} rounded-full object-contain border border-[var(--border)] bg-white shadow-xs`}
      onError={(e) => {
        e.target.src = "https://img.icons8.com/color/96/maintenance.png";
      }}
    />
    <div>
      <p className={`${compact ? "text-lg" : "text-2xl"} font-black text-[var(--primary)] tracking-tight leading-none`}>
        Serviso
      </p>
      {!compact && (
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mt-1">
          Verified home services
        </p>
      )}
    </div>
  </div>
);

export default BrandMark;
