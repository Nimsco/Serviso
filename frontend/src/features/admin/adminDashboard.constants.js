export const ADMIN_TABS = ["Overview", "Users", "Providers", "Bookings", "Services", "Categories"];

export const statColors = {
  totalUsers: "text-[var(--primary)]",
  totalProviders: "text-green-500",
  pendingProviders: "text-yellow-500",
  totalBookings: "text-purple-500",
};

export const statusBadgeClass = (status) => {
  if (status === "completed") {
    return "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20";
  }

  if (status === "cancelled") {
    return "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20";
  }

  if (status === "accepted") {
    return "bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary-border)]/20";
  }

  return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20";
};

export const notificationClass = (type) => {
  if (type === "danger") return "bg-[var(--danger-bg)] border-[var(--danger)]/20 text-[var(--danger)]";
  if (type === "warning") return "bg-[var(--warning-bg)] border-[var(--warning)]/20 text-[var(--warning)]";
  return "bg-[var(--primary-light)] border-[var(--primary-border)]/30 text-[var(--primary)]";
};
