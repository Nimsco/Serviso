const AdminUsersPanel = ({ users, search, setSearch, roleFilter, setRoleFilter, toggleBlock, removeUser }) => (
  <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Manage System Users</h3>
      <div className="flex gap-2 w-full md:w-auto">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="pl-3 pr-8 py-2 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm transition"
        >
          <option value="All">All Roles</option>
          <option value="customer">Customer</option>
          <option value="provider">Provider</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Search user profiles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 pl-3 pr-4 py-2 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm transition"
        />
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[var(--bg-card-hover)] border-b border-[var(--border)] text-[var(--text-secondary)] font-bold text-xs uppercase tracking-wider">
          <tr>
            <th className="p-3.5">Name</th>
            <th className="p-3.5">Email</th>
            <th className="p-3.5">Role</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {users.map((item) => (
            <tr key={item._id} className="hover:bg-[var(--bg-card-hover)]/30 transition">
              <td className="p-3.5 font-semibold text-[var(--text)]">{item.name}</td>
              <td className="p-3.5 text-[var(--text-secondary)]">{item.email}</td>
              <td className="p-3.5 capitalize text-[var(--text-secondary)]">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--bg-card-hover)] border border-[var(--border)] rounded-md text-[var(--text-secondary)]">
                  {item.role}
                </span>
              </td>
              <td className="p-3.5">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                  item.isBlocked
                    ? "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20"
                    : "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20"
                }`}>
                  {item.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td className="p-3.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleBlock(item)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                >
                  {item.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  type="button"
                  onClick={() => removeUser(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminUsersPanel;
