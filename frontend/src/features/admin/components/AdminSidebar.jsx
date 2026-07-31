import { ADMIN_TABS } from "../adminDashboard.constants";

const AdminSidebar = ({ activeTab, setActiveTab, user, theme, toggleTheme, logout }) => {
  return (
    <aside className="w-64 bg-[var(--bg-card)] border-r border-[var(--border)] p-6 hidden md:flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Serviso Logo"
            className="h-9 w-9 object-contain rounded-full"
            onError={(e) => {
              e.target.src = "https://img.icons8.com/color/96/maintenance.png";
            }}
          />
          <h1 className="text-xl font-black text-[var(--primary)] tracking-tight">Serviso Admin</h1>
        </div>
        <p className="text-[var(--text-muted)] text-xs mt-1.5 font-medium break-all">{user?.email}</p>

        <nav className="space-y-1 mt-8">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4 pt-6 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card-hover)] hover:text-[var(--primary)] text-xs font-bold transition duration-200 cursor-pointer"
        >
          {theme === "dark" ? "Light Theme" : "Dark Theme"}
        </button>

        <button
          type="button"
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer shadow-xs active:scale-98"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
