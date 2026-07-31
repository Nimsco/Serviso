import { ADMIN_TABS } from "../adminDashboard.constants";

const AdminTopbar = ({ activeTab, setActiveTab, toggleTheme, logout }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-[var(--border)]">
      <div>
        <p className="text-[var(--primary)] font-bold text-xs uppercase tracking-wider">Management Control</p>
        <h2 className="text-3xl font-extrabold text-[var(--text)] tracking-tight mt-1">{activeTab} Panel</h2>
      </div>

      <div className="flex flex-col md:hidden gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition duration-200 ${
                activeTab === tab
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex-1 bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] px-4 py-2 rounded-xl text-xs font-bold"
          >
            Toggle Theme
          </button>
          <button
            type="button"
            onClick={logout}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar;
