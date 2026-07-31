import { statusBadgeClass } from "../adminDashboard.constants";

const AdminBookingsPanel = ({ bookings, adminCancelBooking }) => (
  <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-6">
    <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Platform Bookings</h3>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-[var(--bg-card-hover)] border-b border-[var(--border)] text-[var(--text-secondary)] font-bold text-xs uppercase tracking-wider">
          <tr>
            <th className="p-3.5">Service</th>
            <th className="p-3.5">Customer</th>
            <th className="p-3.5">Provider</th>
            <th className="p-3.5">Date / Time</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-[var(--bg-card-hover)]/30 transition">
              <td className="p-3.5 font-semibold text-[var(--text)]">{booking.service?.title || "N/A"}</td>
              <td className="p-3.5 text-[var(--text-secondary)]">
                <div className="font-semibold text-[var(--text)]">{booking.customer?.name || "N/A"}</div>
                {booking.customer?.phone && <div className="text-xs">{booking.customer.phone}</div>}
                {booking.customer?.address && <div className="text-xs">{booking.customer.address}</div>}
              </td>
              <td className="p-3.5 text-[var(--text-secondary)]">
                <div className="font-semibold text-[var(--text)]">{booking.provider?.name || "N/A"}</div>
                {booking.provider?.phone && <div className="text-xs">{booking.provider.phone}</div>}
              </td>
              <td className="p-3.5 text-[var(--text-secondary)]">{new Date(booking.date).toLocaleDateString()} {booking.time}</td>
              <td className="p-3.5">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${statusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td className="p-3.5">
                {(booking.status === "pending" || booking.status === "accepted") && (
                  <button
                    type="button"
                    onClick={() => adminCancelBooking(booking._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminBookingsPanel;
