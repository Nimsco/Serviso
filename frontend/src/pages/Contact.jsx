import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


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
    await axios.post("/api/contact", form);

    toast.success("Message sent successfully")
    setForm({ name: "", email: "", message: "" });

  } catch (err) {
    console.error(err);
    toast.error("Failed to send message")
  }
};


  return (
    <div className="min-h-screen bg-blue-50 px-6 md:px-12 py-16">

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-500">Contact Us</h1>
        <p className="text-gray-600 mt-3">
          We are here to help you connect with trusted service providers.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid md:grid-cols-2 gap-10 mt-12 max-w-6xl mx-auto">

        {/* LEFT - Contact Info */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6">

          <h2 className="text-xl font-semibold text-blue-500">
            Get in Touch
          </h2>

          {/* Address */}
          <div className="flex items-start gap-3">
            <img src="/address.png" alt="address" className="h-6 w-6 mt-1" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-gray-600">
                Kamalpokhari, Kathmandu, Nepal
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <img src="/phone.png" alt="phone" className="h-6 w-6 mt-1" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-gray-600">9765289135</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <img src="/email.png" alt="email" className="h-6 w-6 mt-1" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-600">nimeshjoshi7891@gmail.com</p>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            We usually respond within 24 hours.
          </div>

        </div>

        {/* RIGHT - Message Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-xl font-semibold text-blue-500 mb-4">
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              className="w-full border p-2 rounded-md"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        Serviso © {new Date().getFullYear()} — Connecting you with trusted services in Nepal
      </div>

    </div>
  );
};

export default Contact;