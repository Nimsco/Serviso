import { hasAppointmentPassed } from "../providerDashboard.utils";

const ProviderBookingActions = ({ booking, updateStatus }) => {
  if (booking.status !== "pending" && booking.status !== "accepted") {
    return null;
  }

  if (booking.status === "pending") {
    return (
      <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]/50">
        <button
          type="button"
          onClick={() => updateStatus(booking._id, "accepted")}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs px-4 py-2 rounded-xl font-bold transition duration-200 cursor-pointer shadow-xs active:scale-98"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => updateStatus(booking._id, "cancelled")}
          className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 text-xs px-4 py-2 rounded-xl font-bold transition duration-200 cursor-pointer active:scale-98"
        >
          Cancel
        </button>
      </div>
    );
  }

  const canComplete = hasAppointmentPassed(booking);

  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]/50">
      <button
        type="button"
        onClick={() => updateStatus(booking._id, "completed")}
        disabled={!canComplete}
        className={`text-xs px-4 py-2 rounded-xl font-bold transition duration-200 shadow-xs ${
          canComplete
            ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer active:scale-98"
            : "bg-[var(--bg-card-hover)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed"
        }`}
        title={canComplete ? "Mark booking complete" : "You can mark complete after the scheduled time passes"}
      >
        {canComplete ? "Complete" : "Complete after scheduled time"}
      </button>
    </div>
  );
};

export default ProviderBookingActions;
