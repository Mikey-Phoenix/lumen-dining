import { useState } from "react";
import { useNavigate } from "react-router-dom";
import black_bg from "../assets/black_bg.png";
import { registerUser, loginUser } from "../utilis/auth";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isSignUp = mode === "signup";

  const resetForm = () => {
    setName(""); setEmail(""); setPassword(""); setConfirm("");
    setError(""); setSuccess("");
  };

  const switchMode = (m) => { setMode(m); resetForm(); };

  // checks if the email exists in the "users" firestore collection
  const emailExistsInDB = async (email) => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (isSignUp && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await registerUser(email, password, name);
        setSuccess("Account created! Redirecting…");
        setTimeout(() => navigate("/"), 1200);

      } else {
        // block sign in if email is not registered in firestore
        const exists = await emailExistsInDB(email);
        if (!exists) {
          setError("No account found with this email. Please sign up first.");
          setLoading(false);
          return;
        }

        await loginUser(email, password);
        setSuccess("Signed in successfully! Redirecting…");
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err) {
      // make firebase errors more readable
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please sign in.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        backgroundImage: `url(${black_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* logo mark */}
        <div className="flex justify-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* tab switcher */}
        <div
          className="flex rounded-xl mb-8 p-1"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {["signin", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="flex-1 py-2 rounded-lg text-sm font-medium tracking-widest uppercase transition-all duration-300"
              style={{
                background: mode === m ? "rgba(255,255,255,0.12)" : "transparent",
                color: mode === m ? "#ffffff" : "rgba(255,255,255,0.4)",
                border: mode === m ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                letterSpacing: "0.12em",
              }}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* heading */}
        <div className="mb-8">
          <h1
            className="text-2xl sm:text-3xl font-light text-white mb-1"
            style={{ letterSpacing: "-0.02em" }}
          >
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em" }}>
            {isSignUp
              ? "Fill in your details to get started"
              : "Enter your credentials to continue"}
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <InputField
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          )}

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {isSignUp && (
            <InputField
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          )}

          {error && (
            <p
              className="text-xs py-2 px-3 rounded-lg"
              style={{ background: "rgba(255,80,80,0.1)", color: "#ff8080", border: "1px solid rgba(255,80,80,0.2)" }}
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="text-xs py-2 px-3 rounded-lg"
              style={{ background: "rgba(100,255,150,0.08)", color: "#7dffb0", border: "1px solid rgba(100,255,150,0.15)" }}
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium tracking-widest uppercase transition-all duration-300 mt-2"
            style={{
              background: loading ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.92)",
              color: loading ? "rgba(255,255,255,0.3)" : "#111111",
              letterSpacing: "0.14em",
              cursor: loading ? "not-allowed" : "pointer",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {loading ? "Please wait…" : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => switchMode(isSignUp ? "signin" : "signup")}
            className="underline transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

function InputField({ label, type, value, onChange, placeholder, required }) {
  return (
    <div>
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

// login: bajomichael06@gmail.com password: Blah1234