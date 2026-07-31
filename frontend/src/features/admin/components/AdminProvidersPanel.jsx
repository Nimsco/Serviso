const AdminProvidersPanel = ({ providers, decideProvider }) => (
  <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-6">
    <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Provider Registration Submissions</h3>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {providers.map((provider) => (
        <div key={provider._id} className="border border-[var(--border)] rounded-2xl p-5 bg-[var(--bg)]/30 space-y-4">
          <div className="flex items-start gap-4">
            <img
              src={provider.profilePic || "/user.png"}
              alt={provider.name}
              className="h-14 w-14 rounded-full object-cover border border-[var(--border)] shadow-sm"
              onError={(e) => {
                e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
              }}
            />
            <div className="space-y-0.5">
              <h4 className="font-bold text-[var(--text)] leading-snug">{provider.name}</h4>
              <p className="text-xs text-[var(--text-secondary)]">{provider.email}</p>
              {provider.phone && <p className="text-xs text-[var(--text-muted)] font-medium">{provider.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border)] p-3 rounded-xl">
            <p className="flex justify-between gap-3">
              <span className="font-medium text-[var(--text-muted)]">Category:</span>
              <span className="font-bold text-[var(--text)] text-right">{provider.providerDetails?.categories?.join(", ") || "None"}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-[var(--text-muted)]">Exp:</span>
              <span className="font-bold text-[var(--text)]">{provider.providerDetails?.experience || 0} yrs</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-[var(--text-muted)]">Status:</span>
              <span className="font-bold uppercase text-[var(--text)]">{provider.providerStatus}</span>
            </p>
          </div>

          {provider.providerDetails?.bio && (
            <p className="text-xs text-[var(--text-secondary)] italic bg-[var(--bg-card-hover)]/30 border border-[var(--border)]/50 p-2.5 rounded-lg leading-relaxed">
              "{provider.providerDetails.bio}"
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 text-xs">
            {provider.providerDetails?.documents?.citizenshipFront && (
              <a href={provider.providerDetails.documents.citizenshipFront} target="_blank" rel="noreferrer" className="border border-[var(--border)] bg-[var(--bg-card)] text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl py-2 text-center font-semibold transition">
                ID Front
              </a>
            )}
            {provider.providerDetails?.documents?.citizenshipBack && (
              <a href={provider.providerDetails.documents.citizenshipBack} target="_blank" rel="noreferrer" className="border border-[var(--border)] bg-[var(--bg-card)] text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl py-2 text-center font-semibold transition">
                ID Back
              </a>
            )}
            {provider.providerDetails?.documents?.extraDocument && (
              <a href={provider.providerDetails.documents.extraDocument} target="_blank" rel="noreferrer" className="border border-[var(--border)] bg-[var(--bg-card)] text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl py-2 text-center font-semibold transition">
                Extra Doc
              </a>
            )}
          </div>

          {provider.providerStatus === "pending" && (
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => decideProvider(provider._id, "approved")} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 rounded-xl font-bold cursor-pointer transition shadow-xs">
                Approve Application
              </button>
              <button type="button" onClick={() => decideProvider(provider._id, "rejected")} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-2 rounded-xl font-bold cursor-pointer transition shadow-xs">
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default AdminProvidersPanel;
