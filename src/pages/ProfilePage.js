import { useState, useRef, useEffect } from "react";
import black_bg from "../assets/black_bg.png";

// ── Firebase imports ──────────────────────────────────────────────────────────
import { db, auth, storage } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { updatePassword, updateEmail, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ─────────────────────────────────────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────────────────────────────────────
const sectionStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
};
const labelStyle = { color: "rgba(255,255,255,0.4)", letterSpacing: "0.10em" };
const inputBase = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  caretColor: "white",
};
const inputFocus = {
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.08)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Reusable UI components
// ─────────────────────────────────────────────────────────────────────────────
function InputField({ label, type = "text", value, onChange, placeholder, required, readOnly }) {
  return (
    <div className="w-full">
      <label className="block text-xs mb-1.5 uppercase" style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-200"
        style={inputBase}
        onFocus={e => Object.assign(e.target.style, inputFocus)}
        onBlur={e => Object.assign(e.target.style, inputBase)}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div className="w-full">
      <label className="block text-xs mb-1.5 uppercase" style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 appearance-none"
        style={{ ...inputBase, color: value ? "white" : "rgba(255,255,255,0.35)" }}
        onFocus={e => Object.assign(e.target.style, inputFocus)}
        onBlur={e => Object.assign(e.target.style, inputBase)}
      >
        <option value="" disabled style={{ background: "#1a1a1a" }}>{placeholder}</option>
        {options.map(o => (
          <option key={o} value={o} style={{ background: "#1a1a1a", color: "white" }}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="w-full rounded-2xl p-6 sm:p-8 space-y-4" style={sectionStyle}>
      <h2
        className="text-xs uppercase tracking-widest mb-5 pb-3"
        style={{ color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.07)", letterSpacing: "0.18em" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-200"
      style={{
        letterSpacing: "0.12em",
        background: active ? "#800020" : "transparent",
        color: active ? "white" : "rgba(255,255,255,0.4)",
        border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {label}
    </button>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0"
        style={{
          background: checked ? "#800020" : "rgba(255,255,255,0.05)",
          border: checked ? "none" : "1px solid rgba(255,255,255,0.15)",
        }}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path d="M1 4L4 7L10 1" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
    </label>
  );
}

function StatusBanner({ status, message }) {
  if (!status) return null;
  const isSuccess = status === "success";
  return (
    <p
      className="text-xs py-2 px-3 rounded-lg"
      style={{
        background: isSuccess ? "rgba(100,255,150,0.08)" : "rgba(255,80,80,0.08)",
        color: isSuccess ? "#7dffb0" : "#ff9090",
        border: `1px solid ${isSuccess ? "rgba(100,255,150,0.15)" : "rgba(255,80,80,0.15)"}`,
      }}
    >
      {message}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Logout Confirmation Modal
// ─────────────────────────────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel, loading }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-5"
        style={sectionStyle}
      >
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "rgba(128,0,32,0.15)", border: "1px solid rgba(128,0,32,0.3)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3"
              stroke="#cc2244"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-white text-lg font-light mb-1" style={{ letterSpacing: "-0.01em" }}>Sign out?</h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            You'll need to sign back in to access your profile and orders.
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-full text-sm transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-full text-sm text-white transition-all duration-200"
            style={{
              background: loading ? "rgba(128,0,32,0.4)" : "#800020",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Profile component
// ─────────────────────────────────────────────────────────────────────────────
export default function Profile() {
  const fileRef = useRef();

  // ── UI state ────────────────────────────────────────────────────────────────
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [tabStatus, setTabStatus] = useState({ status: null, message: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // ── Personal ─────────────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [halal, setHalal] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [noNuts, setNoNuts] = useState(false);

  // ── Delivery ─────────────────────────────────────────────────────────────────
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal, setPostal] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  // ── Order preferences ────────────────────────────────────────────────────────
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [deliveryTime, setDeliveryTime] = useState("ASAP");
  const [customizations, setCustomizations] = useState("");
  const [promoCode, setPromoCode] = useState("");

  // ── Payment ──────────────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardLast4, setCardLast4] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [expiry, setExpiry] = useState("");
  const [mobileProvider, setMobileProvider] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  // ── Account ──────────────────────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [rating, setRating] = useState(0);
  const [memberSince, setMemberSince] = useState("Jan 2025");

  // ── Load data from Firestore on mount ─────────────────────────────────────
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    async function loadProfile() {
      try {
        const uid = user.uid;
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFullName(data.name ?? "");
          setPhone(data.personal?.phoneNumber ?? "");
          setEmail(data.personal?.email ?? user.email ?? "");
          setUsername(data.account?.username ?? "");
          setHalal(data.preferences?.dietaryPreferences?.halal ?? false);
          setVegan(data.preferences?.dietaryPreferences?.vegan ?? false);
          setGlutenFree(data.preferences?.dietaryPreferences?.glutenFree ?? false);
          setNoNuts(data.preferences?.dietaryPreferences?.nutAllergy ?? false);
          setNewsletter(data.preferences?.newsletterSubscribed ?? true);
          setPromoCode(data.preferences?.promoCode ?? "");

          const addr = data.defaultDeliveryAddress ?? {};
          setStreet(addr.street ?? "");
          setApartment(addr.apartment ?? "");
          setCity(addr.city ?? "");
          setState(addr.state ?? "");
          setPostal(addr.postalCode ?? "");
          setLandmark(addr.landmark ?? "");
          setDeliveryInstructions(addr.deliveryInstructions ?? "");

          setSpiceLevel(data.orderPreferences?.spiceLevel ?? "Medium");
          setDeliveryTime(data.orderPreferences?.preferredDeliveryTime ?? "ASAP");
          setCustomizations(data.orderPreferences?.defaultCustomizations ?? "");

          const pay = data.savedPayment ?? {};
          setPaymentMethod(pay.method ?? "Card");
          setCardLast4(pay.card?.last4 ?? "");
          setCardBrand(pay.card?.brand ?? "");
          setExpiry(pay.card?.expiry ?? "");
          setMobileProvider(pay.mobile?.provider ?? "");
          setMobileNumber(pay.mobile?.phoneNumber ?? "");
          setBillingAddress(pay.billingAddress ?? "");

          if (data.account?.createdAt?.toDate) {
            const d = data.account.createdAt.toDate();
            setMemberSince(d.toLocaleString("default", { month: "short", year: "numeric" }));
          }

          if (data.avatarUrl) setAvatar(data.avatarUrl);
          setRating(data.lastOrderRating ?? 0);
        } else {
          setEmail(user.email ?? "");
        }

        const addrSnap = await getDocs(collection(db, "userAddresses", uid, "addresses"));
        setSavedAddresses(addrSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const { query, where, orderBy, limit } = await import("firebase/firestore");
        const ordersQ = query(
          collection(db, "orders"),
          where("uid", "==", uid),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const ordersSnap = await getDocs(ordersQ);
        setOrderHistory(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setInitialLoad(false);
      }
    }

    loadProfile();
  }, []);

  // ── Avatar picker ─────────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  async function uploadAvatar(uid) {
    if (!avatarFile) return null;
    const storageRef = ref(storage, `avatars/${uid}`);
    await uploadBytes(storageRef, avatarFile);
    return await getDownloadURL(storageRef);
  }

  function showStatus(status, message) {
    setTabStatus({ status, message });
    setTimeout(() => setTabStatus({ status: null, message: "" }), 3000);
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function handleLogout() {
    setLogoutLoading(true);
    try {
      await signOut(auth);
      // Redirect to login — adjust path for your router setup
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  }

  // ── Save handlers ─────────────────────────────────────────────────────────

  async function savePersonal() {
    const user = auth.currentUser;
    if (!user) return showStatus("error", "Not signed in.");
    setLoading(true);
    try {
      const uid = user.uid;
      const avatarUrl = await uploadAvatar(uid);
      await setDoc(doc(db, "users", uid), {
        personal: { fullName, phoneNumber: phone, email },
        preferences: {
          newsletterSubscribed: newsletter,
          dietaryPreferences: { halal, vegan, glutenFree, nutAllergy: noNuts },
          promoCode: promoCode || null,
        },
        ...(avatarUrl && { avatarUrl }),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      if (email !== user.email) await updateEmail(user, email);
      setAvatarFile(null);
      showStatus("success", "Personal info saved.");
    } catch (err) {
      showStatus("error", "Failed to save. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveDelivery() {
    const user = auth.currentUser;
    if (!user) return showStatus("error", "Not signed in.");
    setLoading(true);
    try {
      const uid = user.uid;
      const addressPayload = {
        street, apartment: apartment || null, city, state,
        postalCode: postal, country: "Nigeria",
        landmark: landmark || null,
        deliveryInstructions: deliveryInstructions || null,
      };
      await setDoc(doc(db, "users", uid), {
        defaultDeliveryAddress: addressPayload,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      const addrRef = collection(db, "userAddresses", uid, "addresses");
      const existing = savedAddresses.find(a => a.label === "Default");
      if (existing) {
        await updateDoc(doc(db, "userAddresses", uid, "addresses", existing.id), {
          ...addressPayload, label: "Default", isDefault: true, updatedAt: serverTimestamp(),
        });
      } else {
        const newDoc = await addDoc(addrRef, {
          ...addressPayload, label: "Default", isDefault: true, createdAt: serverTimestamp(),
        });
        setSavedAddresses(prev => [...prev, { id: newDoc.id, ...addressPayload, label: "Default", isDefault: true }]);
      }
      showStatus("success", "Delivery info saved.");
    } catch (err) {
      showStatus("error", "Failed to save. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveOrderPreferences() {
    const user = auth.currentUser;
    if (!user) return showStatus("error", "Not signed in.");
    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        orderPreferences: {
          spiceLevel,
          preferredDeliveryTime: deliveryTime,
          defaultCustomizations: customizations || null,
        },
        preferences: { promoCode: promoCode || null },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      showStatus("success", "Order preferences saved.");
    } catch (err) {
      showStatus("error", "Failed to save. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function savePayment() {
    const user = auth.currentUser;
    if (!user) return showStatus("error", "Not signed in.");
    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        savedPayment: {
          method: paymentMethod,
          billingAddress: billingAddress || null,
          card: paymentMethod === "Card" ? { last4: cardLast4, brand: cardBrand, expiry } : null,
          mobile: paymentMethod === "Mobile Payment" ? { provider: mobileProvider, phoneNumber: mobileNumber } : null,
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      showStatus("success", "Payment preferences saved.");
    } catch (err) {
      showStatus("error", "Failed to save. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveAccount() {
    const user = auth.currentUser;
    if (!user) return showStatus("error", "Not signed in.");
    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        account: { username },
        preferences: { newsletterSubscribed: newsletter },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      if (newPassword.trim()) {
        await updatePassword(user, newPassword.trim());
        setNewPassword("");
      }
      showStatus("success", "Account settings saved.");
    } catch (err) {
      showStatus("error", "Failed to save. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitRating(star) {
    const user = auth.currentUser;
    if (!user) return;
    setRating(star);
    try {
      await setDoc(doc(db, "users", user.uid), {
        lastOrderRating: star,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      if (orderHistory.length > 0) {
        await updateDoc(doc(db, "orders", orderHistory[0].id), {
          review: { rating: star, submittedAt: serverTimestamp() },
        });
      }
    } catch (err) {
      console.error("Rating save error:", err);
    }
  }

  function handleSave() {
    if (activeTab === "personal") savePersonal();
    else if (activeTab === "delivery") saveDelivery();
    else if (activeTab === "order") saveOrderPreferences();
    else if (activeTab === "payment") savePayment();
    else if (activeTab === "account") saveAccount();
  }

  const tabs = [
    { id: "personal", label: "Personal" },
    { id: "delivery", label: "Delivery" },
    { id: "order", label: "Order" },
    { id: "payment", label: "Payment" },
    { id: "account", label: "Account" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  if (initialLoad) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center" style={{ background: "#000" }}>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Loading profile…</p>
      </main>
    );
  }

  return (
    <>
      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
          loading={logoutLoading}
        />
      )}

      <main
        className="min-h-screen w-full flex flex-col items-center justify-start px-4 pt-20 pb-16 relative overflow-hidden"
        style={{
          backgroundImage: `url(${black_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 w-full max-w-2xl mb-8">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-2" style={{ letterSpacing: "-0.03em" }}>MY PROFILE</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>Manage your account, delivery & preferences</p>
        </div>

        {/* ── Avatar / Profile Card ───────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-2xl mb-6">
          <div className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6" style={sectionStyle}>

            {/* Avatar */}
            <div className="relative w-fit mx-auto flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
                style={{ border: "2px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)" }}
                onClick={() => fileRef.current.click()}
              >
                {avatar
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )
                }
              </div>
              {/* Upload button */}
              <div
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "rgba(255,255,255,0.9)" }}
                onClick={() => fileRef.current.click()}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#111" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Name & details */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-lg font-light truncate" style={{ letterSpacing: "-0.01em" }}>
                {fullName || "Your Name"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                @{username || "username"}
              </p>
              <p className="text-xs mt-1 truncate" style={{ color: "rgba(255,255,255,0.25)" }}>
                {email}
              </p>

              {/* Member badge — visible on mobile too, moved here */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full"
                  style={{ background: "rgba(100,255,150,0.08)", color: "#7dffb0", border: "1px solid rgba(100,255,150,0.15)" }}
                >
                  Active
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Member since {memberSince}
                </span>
              </div>
            </div>

            {/* ── Log Out Button ─────────────────────────────────────────── */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-fit flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs uppercase transition-all duration-200 group"
              style={{
                background: "rgba(128,0,32,0.12)",
                border: "1px solid rgba(128,0,32,0.35)",
                color: "rgba(255,120,120,0.8)",
                letterSpacing: "0.10em",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(128,0,32,0.25)";
                e.currentTarget.style.borderColor = "rgba(128,0,32,0.6)";
                e.currentTarget.style.color = "#ff9090";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(128,0,32,0.12)";
                e.currentTarget.style.borderColor = "rgba(128,0,32,0.35)";
                e.currentTarget.style.color = "rgba(255,120,120,0.8)";
              }}
            >
              {/* Arrow-right-from-bracket icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path
                  d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Log out</span>
            </button>

          </div>
        </div>

        {/* Tabs */}
        <div className="relative z-10 w-full max-w-2xl mb-5 flex gap-2 flex-wrap">
          {tabs.map(t => (
            <Tab
              key={t.id}
              label={t.label}
              active={activeTab === t.id}
              onClick={() => { setActiveTab(t.id); setTabStatus({ status: null, message: "" }); }}
            />
          ))}
        </div>

        {/* Tab Content */}
        <div className="relative z-10 w-full max-w-2xl space-y-5">

          {/* ── PERSONAL ─────────────────────────────────────────────────── */}
          {activeTab === "personal" && (
            <Section title="Personal Information">
              <div className="flex flex-col sm:flex-row gap-4">
                <InputField label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
                <InputField label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <InputField label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 000 000 0000" />
                <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs mb-1.5 uppercase" style={labelStyle}>Dietary Preferences</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <CheckboxField label="Halal" checked={halal} onChange={setHalal} />
                  <CheckboxField label="Vegan" checked={vegan} onChange={setVegan} />
                  <CheckboxField label="Gluten-Free" checked={glutenFree} onChange={setGlutenFree} />
                  <CheckboxField label="No Nuts (Allergy)" checked={noNuts} onChange={setNoNuts} />
                </div>
              </div>
              <CheckboxField label="Subscribe to newsletter & promotions" checked={newsletter} onChange={setNewsletter} />
              <InputField label="Promo / Discount Code" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter code (optional)" />
              <StatusBanner {...tabStatus} />
            </Section>
          )}

          {/* ── DELIVERY ─────────────────────────────────────────────────── */}
          {activeTab === "delivery" && (
            <Section title="Delivery Information">
              <div className="flex flex-col sm:flex-row gap-4">
                <InputField label="Street Name & Number" value={street} onChange={e => setStreet(e.target.value)} placeholder="14 Adeola Odeku Street" />
                <InputField label="Apartment / Flat" value={apartment} onChange={e => setApartment(e.target.value)} placeholder="Flat 3B (optional)" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <InputField label="City" value={city} onChange={e => setCity(e.target.value)} placeholder="Lagos" />
                <InputField label="State" value={state} onChange={e => setState(e.target.value)} placeholder="Lagos State" />
                <InputField label="Postal / ZIP Code" value={postal} onChange={e => setPostal(e.target.value)} placeholder="100001" />
              </div>
              <InputField label="Landmark (optional)" value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="e.g. Opposite First Bank, near Shoprite" />
              <div>
                <label className="block text-xs mb-1.5 uppercase" style={labelStyle}>Delivery Instructions</label>
                <textarea
                  value={deliveryInstructions}
                  onChange={e => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Call when outside, leave at gate, ring bell twice…"
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-200 resize-none"
                  style={inputBase}
                  onFocus={e => Object.assign(e.target.style, inputFocus)}
                  onBlur={e => Object.assign(e.target.style, inputBase)}
                />
              </div>
              {savedAddresses.length > 0 && (
                <div>
                  <label className="block text-xs mb-3 uppercase" style={labelStyle}>Saved Addresses</label>
                  <div className="space-y-2">
                    {savedAddresses.map(a => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div>
                          <p className="text-xs uppercase mb-0.5" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{a.label}</p>
                          <p className="text-sm text-white">{a.street}{a.city ? `, ${a.city}` : ""}</p>
                        </div>
                        {a.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(100,255,150,0.08)", color: "#7dffb0", border: "1px solid rgba(100,255,150,0.15)" }}>Default</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <StatusBanner {...tabStatus} />
            </Section>
          )}

          {/* ── ORDER ────────────────────────────────────────────────────── */}
          {activeTab === "order" && (
            <>
              <Section title="Order Preferences">
                <div className="flex flex-col sm:flex-row gap-4">
                  <SelectField label="Spice Level" value={spiceLevel} onChange={e => setSpiceLevel(e.target.value)} options={["Mild", "Medium", "Hot", "Extra Hot"]} placeholder="Select spice level" />
                  <SelectField label="Preferred Delivery Time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} options={["ASAP", "In 30 mins", "In 1 hour", "Schedule for later"]} placeholder="Select time" />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 uppercase" style={labelStyle}>Default Customizations</label>
                  <textarea
                    value={customizations}
                    onChange={e => setCustomizations(e.target.value)}
                    placeholder="e.g. No onions, extra cheese, no pepper…"
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-200 resize-none"
                    style={inputBase}
                    onFocus={e => Object.assign(e.target.style, inputFocus)}
                    onBlur={e => Object.assign(e.target.style, inputBase)}
                  />
                </div>
                <InputField label="Promo / Discount Code" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter code (optional)" />
                <StatusBanner {...tabStatus} />
              </Section>

              <Section title="Order History">
                {orderHistory.length === 0 ? (
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orderHistory.map(order => {
                      const status = order.status ?? "pending";
                      const isDelivered = status === "delivered";
                      return (
                        <div key={order.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <div>
                            <p className="text-sm text-white">
                              #{order.id.slice(-5).toUpperCase()} —{" "}
                              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                {order.items?.map(i => `${i.name} × ${i.quantity}`).join(", ") ?? "—"}
                              </span>
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                              {order.createdAt?.toDate?.().toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) ?? "—"}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="text-sm text-white">₦{order.total?.toLocaleString() ?? "—"}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{
                              background: isDelivered ? "rgba(100,255,150,0.08)" : "rgba(255,180,80,0.08)",
                              color: isDelivered ? "#7dffb0" : "#ffcc55",
                              border: `1px solid ${isDelivered ? "rgba(100,255,150,0.15)" : "rgba(255,180,80,0.15)"}`,
                            }}>{status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>
            </>
          )}

          {/* ── PAYMENT ──────────────────────────────────────────────────── */}
          {activeTab === "payment" && (
            <Section title="Payment Information">
              <div>
                <label className="block text-xs mb-2 uppercase" style={labelStyle}>Payment Method</label>
                <div className="flex gap-2 flex-wrap">
                  {["Card", "Bank Transfer", "Mobile Payment", "Cash on Delivery"].map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className="px-4 py-2 rounded-full text-xs transition-all duration-200"
                      style={{
                        background: paymentMethod === m ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.05)",
                        color: paymentMethod === m ? "#111" : "rgba(255,255,255,0.5)",
                        border: paymentMethod === m ? "none" : "1px solid rgba(255,255,255,0.10)",
                      }}
                    >{m}</button>
                  ))}
                </div>
              </div>

              {paymentMethod === "Card" && (
                <>
                  <p className="text-xs" style={{ color: "rgba(255,150,100,0.7)" }}>
                    ⚠️ For security, use a payment gateway (e.g. Paystack) in production. Only enter the last 4 digits and card brand here.
                  </p>
                  <div className="flex gap-4">
                    <InputField label="Last 4 Digits" value={cardLast4} onChange={e => setCardLast4(e.target.value.slice(0, 4))} placeholder="4242" />
                    <InputField label="Card Brand" value={cardBrand} onChange={e => setCardBrand(e.target.value)} placeholder="Visa / Mastercard" />
                    <InputField label="Expiry" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" />
                  </div>
                  <InputField label="Billing Address" value={billingAddress} onChange={e => setBillingAddress(e.target.value)} placeholder="Same as delivery address" />
                </>
              )}

              {paymentMethod === "Bank Transfer" && (
                <div className="rounded-xl px-4 py-4 text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
                  Transfer to <span className="text-white">Chow Express Ltd</span> — Zenith Bank<br />
                  Account: <span className="text-white">1234567890</span><br />
                  Use your order ID as reference after placing your order.
                </div>
              )}

              {paymentMethod === "Mobile Payment" && (
                <div className="flex gap-4">
                  <SelectField label="Provider" value={mobileProvider} onChange={e => setMobileProvider(e.target.value)} options={["OPay", "PalmPay", "MTN MoMo", "Kuda"]} placeholder="Select provider" />
                  <InputField label="Mobile Wallet Number" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="+234 000 000 0000" />
                </div>
              )}

              {paymentMethod === "Cash on Delivery" && (
                <div className="rounded-xl px-4 py-4 text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
                  Pay with cash when your order arrives. Please have the exact amount ready.
                </div>
              )}

              <StatusBanner {...tabStatus} />
            </Section>
          )}

          {/* ── ACCOUNT ──────────────────────────────────────────────────── */}
          {activeTab === "account" && (
            <Section title="Account Settings">
              <div className="flex flex-col sm:flex-row gap-4">
                <InputField label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" />
                <InputField label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" />
              </div>

              <div>
                <label className="block text-xs mb-3 uppercase" style={labelStyle}>Preferences</label>
                <CheckboxField label="Subscribe to newsletter & promotions" checked={newsletter} onChange={setNewsletter} />
              </div>

              {savedAddresses.length > 0 && (
                <div>
                  <label className="block text-xs mb-3 uppercase" style={labelStyle}>Saved Addresses</label>
                  <div className="space-y-2">
                    {savedAddresses.map(a => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div>
                          <p className="text-xs uppercase mb-0.5" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{a.label}</p>
                          <p className="text-sm text-white">{a.street}{a.city ? `, ${a.city}` : ""}</p>
                        </div>
                        {a.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(100,255,150,0.08)", color: "#7dffb0", border: "1px solid rgba(100,255,150,0.15)" }}>Default</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs mb-3 uppercase" style={labelStyle}>Rate Your Last Order</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => submitRating(star)}
                      className="text-2xl transition-all duration-150 hover:scale-110"
                      style={{ color: star <= rating ? "rgba(255,200,80,0.9)" : "rgba(255,255,255,0.15)" }}
                    >★</button>
                  ))}
                </div>
                {rating > 0 && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>You rated {rating} / 5 — saved.</p>}
              </div>

              <StatusBanner {...tabStatus} />
            </Section>
          )}

          {/* ── Save Button ───────────────────────────────────────────────── */}
          {activeTab !== "order" && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="py-3 px-12 rounded-full text-sm text-white font-medium uppercase transition-all duration-300 bg-[#800020] hover:bg-[#9b0127]"
              >
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          )}

          {activeTab === "order" && (
            <div className="flex justify-end pt-2">
              <button
                onClick={saveOrderPreferences}
                disabled={loading}
                className="py-3 px-12 rounded-full text-sm font-medium uppercase transition-all duration-300"
                style={{
                  background: loading ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.92)",
                  color: loading ? "rgba(255,255,255,0.3)" : "#111",
                  letterSpacing: "0.14em",
                  cursor: loading ? "not-allowed" : "pointer",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {loading ? "Saving…" : "Save Preferences"}
              </button>
            </div>
          )}

        </div>
      </main>
    </>
  );
}