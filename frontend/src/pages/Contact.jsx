import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../api/config";
import PageHeader from "../components/UI/PageHeader";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/contact`, form);

      toast.success("Message sent successfully");
      setForm({ name: "", email: "", message: "" });

    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <PageHeader
        eyebrow="Support"
        title="Need help with a booking, provider, or payment?"
        description="Reach the Serviso team for account questions, provider verification, booking issues, and platform support."
        image="/service-it-kathmandu.jpg"
        stats={[
          { value: "24h", label: "Typical response" },
          { value: "Email", label: "Support channel" },
          { value: "Local", label: "Kathmandu operations" },
          { value: "Secure", label: "Payment support" },
        ]}
      />

      {/* Main Layout */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch px-6 md:px-12 py-12">

        {/* LEFT - Contact Info */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--primary)] tracking-tight">
              Get in Touch
            </h2>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center border border-[var(--primary)]/15 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[var(--text)] text-sm">Address</p>
                <p className="text-[var(--text-secondary)] text-sm mt-0.5 leading-relaxed">
                  Kamalpokhari, Kathmandu, Nepal
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center border border-[var(--primary)]/15 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[var(--text)] text-sm">Phone</p>
                <p className="text-[var(--text-secondary)] text-sm mt-0.5 leading-relaxed">9765289135</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg flex items-center justify-center border border-[var(--primary)]/15 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[var(--text)] text-sm">Email</p>
                <p className="text-[var(--text-secondary)] text-sm mt-0.5 leading-relaxed break-all">nimeshjoshi7891@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-[var(--text-muted)] font-semibold border-t border-[var(--border)] pt-4 mt-auto">
            🕒 We usually respond to support requests within 24 hours.
          </div>

        </div>

        {/* RIGHT - Message Form */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 rounded-2xl shadow-sm flex flex-col justify-between">
          
          <div>
            <h2 className="text-2xl font-bold text-[var(--primary)] tracking-tight mb-6">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Your Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Your Message</label>
                <textarea
                  name="message"
                  placeholder="Tell us what you need help with..."
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 transition duration-200 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center mt-16 text-[var(--text-muted)] text-sm font-medium">
        Serviso &copy; {new Date().getFullYear()} &mdash; Connecting you with trusted services in Nepal
      </div>

    </div>
  );
};

export default Contact;
