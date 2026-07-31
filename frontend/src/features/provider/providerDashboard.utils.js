export const emptyService = {
  price: "",
  description: "",
  availability: "",
};

export const serviceToForm = (service) => ({
  price: service?.price ?? "",
  description: service?.description || "",
  availability: service?.availability || "",
});

export const getBookingAppointmentDate = (booking) => {
  const appointmentDate = new Date(booking.date);

  if (Number.isNaN(appointmentDate.getTime()) || !booking.time) {
    return null;
  }

  const [hours, minutes] = booking.time.split(":").map(Number);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  appointmentDate.setHours(hours, minutes || 0, 0, 0);
  return appointmentDate;
};

export const hasAppointmentPassed = (booking) => {
  const appointmentDate = getBookingAppointmentDate(booking);
  return appointmentDate ? appointmentDate <= new Date() : false;
};

export const statusStyle = {
  pending: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20",
  accepted: "bg-[var(--primary-light)] text-[var(--primary)] border-[var(--primary-border)]/20",
  completed: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20",
  cancelled: "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20",
};
