import { notificationClass, statColors } from "../adminDashboard.constants";

const fillDays = (items, key = "count") => {
  const lookup = new Map((items || []).map((item) => [item._id, item[key] || 0]));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const id = date.toISOString().slice(0, 10);

    return {
      id,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      value: lookup.get(id) || 0,
    };
  });
};

const StatCard = ({ label, value, tone }) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28">
    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</span>
    <h3 className={`text-3xl font-extrabold mt-2 ${tone}`}>{value}</h3>
  </div>
);

const BarChart = ({ title, data, valuePrefix = "" }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
      <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">{title}</h3>
      <div className="h-48 flex items-end gap-3 mt-6">
        {data.map((item) => (
          <div key={item.id} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div className="h-36 w-full flex items-end justify-center">
              <div
                className="w-full max-w-10 rounded-t-xl bg-[var(--primary)] transition-all duration-500"
                style={{ height: `${Math.max((item.value / maxValue) * 100, item.value ? 8 : 2)}%` }}
                title={`${item.label}: ${valuePrefix}${item.value}`}
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{item.label}</span>
            <span className="text-xs font-bold text-[var(--text)]">{valuePrefix}{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const AdminOverview = ({ stats, setActiveTab }) => {
  const statusBars = stats?.bookingsByStatus || [];
  const maxStatusCount = Math.max(...statusBars.map((item) => item.count), 1);
  const bookingTrend = fillDays(stats?.bookingsByDay, "count");
  const revenueTrend = fillDays(stats?.revenueByDay, "total");
  const notifications = stats?.notifications || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Users" value={stats.totalUsers} tone={statColors.totalUsers} />
        <StatCard label="Approved Providers" value={stats.totalProviders} tone={statColors.totalProviders} />
        <StatCard label="Pending Providers" value={stats.pendingProviders} tone={statColors.pendingProviders} />
        <StatCard label="Total Bookings" value={stats.totalBookings} tone={statColors.totalBookings} />
      </div>

      {notifications.length > 0 && (
        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Notifications</h3>
            <span className="text-xs font-bold bg-[var(--bg-card-hover)] px-3 py-1 rounded-full border border-[var(--border)]">
              {notifications.length} Active
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-5">
            {notifications.map((item) => (
              <button
                key={`${item.title}-${item.message}`}
                type="button"
                onClick={() => {
                  if (item.title.includes("Provider")) setActiveTab("Providers");
                  if (item.title.includes("booking")) setActiveTab("Bookings");
                  if (item.title.includes("Inactive")) setActiveTab("Services");
                  if (item.title.includes("Blocked")) setActiveTab("Users");
                }}
                className={`text-left border rounded-xl p-4 transition hover:scale-[1.01] cursor-pointer ${notificationClass(item.type)}`}
              >
                <p className="text-sm font-extrabold">{item.title}</p>
                <p className="text-xs mt-1 leading-relaxed opacity-90">{item.message}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <BarChart title="Bookings Created: Last 7 Days" data={bookingTrend} />
        <BarChart title="Completed Revenue: Last 7 Days" data={revenueTrend} valuePrefix="Rs. " />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Booking Status Summary</h3>
          <div className="space-y-4 mt-6">
            {statusBars.map((item) => (
              <div key={item._id}>
                <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                  <span className="capitalize">{item._id}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 bg-[var(--bg-card-hover)] rounded-full mt-2 overflow-hidden border border-[var(--border)]/30">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
          <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Health Metrics</h3>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)]/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Completion</span>
              <p className="text-2xl font-black text-green-500 mt-1">{stats.completionRate}%</p>
            </div>
            <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)]/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Inactive</span>
              <p className="text-2xl font-black text-red-500 mt-1">{stats.inactiveServices}</p>
            </div>
            <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)]/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Accepted</span>
              <p className="text-2xl font-black text-[var(--primary)] mt-1">{stats.acceptedBookings}</p>
            </div>
            <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)]/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Earnings</span>
              <p className="text-2xl font-black text-purple-500 mt-1">Rs. {stats.completedValue}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminOverview;
