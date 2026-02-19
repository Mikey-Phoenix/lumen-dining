import { useState } from "react";
import black_bg from "../assets/black_bg.png";

const topics = [
  "General Enquiry",
  "Partnership Opportunity",
  "Support Request",
  "Feedback",
  "Other",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // hook your submission logic here
    setTimeout(() => {
      setLoading(false);
      setSuccess("Message sent! We'll get back to you shortly.");
      setName(""); setEmail(""); setPhone("");
      setLocation(""); setTopic(""); setMessage("");
    }, 1200);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start px-4 pt-20 md:pt-32 pb-16 relative overflow-hidden"
      style={{
        backgroundImage: `url(${black_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* vignette */}
      <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />

      {/* heading */}
      <div className="relative z-10 text-center mb-10">
        <h1
          className="text-4xl md:text-6xl font-light text-white mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          CONTACT US
        </h1>
        <p
          className="text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.02em" }}
        >
          Send us a message and we'll get back to you as soon as possible.
          Looking forward to hearing from you.
        </p>
      </div>

      {/* glass card */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl p-8 sm:p-10"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* name + email row */}
          <div className="flex flex-col lg:flex-row gap-4">
            <InputField
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* phone + location row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/5">
              <InputField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 000 000 0000"
              />
            </div>
            <div className="w-full sm:w-3/5">
              <InputField
                label="Location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* topic select */}
          <div>
            <label
              className="block text-xs mb-1.5 tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.10em" }}
            >
              What are you getting in touch about?
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 appearance-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: topic ? "white" : "rgba(255,255,255,0.35)",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(255,255,255,0.35)";
                e.target.style.background = "rgba(255,255,255,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255,255,255,0.10)";
                e.target.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <option value="" disabled style={{ background: "#1a1a1a" }}>
                Select a topic…
              </option>
              {topics.map((t) => (
                <option key={t} value={t} style={{ background: "#1a1a1a", color: "white" }}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* message */}
          <div>
            <label
              className="block text-xs mb-1.5 tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.10em" }}
            >
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here…"
              rows={5}
              className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-200 resize-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                caretColor: "white",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(255,255,255,0.35)";
                e.target.style.background = "rgba(255,255,255,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255,255,255,0.10)";
                e.target.style.background = "rgba(255,255,255,0.05)";
              }}
            />
          </div>

          {/* success message */}
          {success && (
            <p
              className="text-xs py-2 px-3 rounded-lg"
              style={{
                background: "rgba(100,255,150,0.08)",
                color: "#7dffb0",
                border: "1px solid rgba(100,255,150,0.15)",
              }}
            >
              {success}
            </p>
          )}

          {/* submit */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-12 rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-300 bg-[#800020] hover:bg-[#9b0127] text-white"
            >
              {loading ? "Sending…" : "Send"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ── Reusable input ──────────────────────────────
function InputField({ label, type, value, onChange, placeholder, required }) {
  return (
    <div className="w-full">
      <label
        className="block text-xs mb-1.5 tracking-widest uppercase"
        style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.10em" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.10)",
          caretColor: "white",
        }}
        onFocus={(e) => {
          e.target.style.border = "1px solid rgba(255,255,255,0.35)";
          e.target.style.background = "rgba(255,255,255,0.08)";
        }}
        onBlur={(e) => {
          e.target.style.border = "1px solid rgba(255,255,255,0.10)";
          e.target.style.background = "rgba(255,255,255,0.05)";
        }}
      />
    </div>
  );
}