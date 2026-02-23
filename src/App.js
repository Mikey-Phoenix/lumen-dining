import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from "./hooks/useAuth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { CheckoutProvider } from "./components/checkout";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import Home from './pages/Home';
import Menu from './pages/Menu';
import Delivery from './pages/Delivery';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Profile from './pages/ProfilePage';
import Preloader from './components/Preloader';

// ── NavLinks — fixed setLoading removal + lowercase links ─────────────────
const NavLinks = ({ toggleNavBar }) => {
  const { user } = useAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          // ✅ matches your Firestore structure from earlier in this conversation
          setUserName(userDoc.data().name ?? "Profile");
        }
      }
    };
    fetchUserName();
  }, [user]);

  return (
    <>
      <Link to="/menu" className="text-white no-underline w-full md:w-fit border-b-2 md:border-0 my-3 md:my-0 hover:text-[#C5A059]">Menu</Link>
      <Link to="/delivery" className="text-white no-underline w-full md:w-fit border-b-2 md:border-0 my-3 md:my-0 hover:text-[#C5A059]">Delivery</Link>
      <Link to="/contact" className="text-white no-underline w-full md:w-fit border-b-2 md:border-0 my-3 md:my-0 hover:text-[#C5A059]">Contact</Link>
      {user ? (
        <Link to="/profile" className="text-white bg-[#800020] py-2 px-3 md:px-10 rounded-full no-underline transition-all ease-in-out duration-300 hover:bg-[#9b0127]">
          {userName || "Profile"}
        </Link>
      ) : (
        <Link to="/signin" className="text-white bg-[#800020] py-2 px-3 md:px-10 rounded-full no-underline transition-all ease-in-out duration-300 hover:bg-[#9b0127]">
          Log In
        </Link>
      )}
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavBar = () => setIsOpen(prev => !prev);

  return (
    <>
      {loading && (
        <Preloader onComplete={() => setLoading(false)} />
      )}

      {!loading && (
        <CheckoutProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-100">

              {/* ── Navbar ───────────────────────────────────────────── */}
              {isOpen ? (
                <nav className="fixed top-0 left-[50%] translate-x-[-50%] h-[90vh] md:h-16 w-[95vw] md:w-[80vw] mt-3 px-4 bg-[#1F1F22] md:bg-black/60 rounded-3xl md:rounded-full z-50">
                  <div className="flex flex-wrap justify-between mt-5">
                    <Link to="/" className="text-white font-bold md:text-2xl h-fit no-underline lavishly-yours-regular">Lumen Dining</Link>
                    <button className="text-white font-bold text-xl h-fit md:hidden" onClick={toggleNavBar}>
                      <IoClose />
                    </button>
                  </div>

                  <div className="pt-0 px-2 flex flex-col flex-wrap basis-full my-3" onClick={toggleNavBar}>
                    <NavLinks />
                  </div>

                  <div className="text-white absolute bottom-0 left-0 pl-5 pb-3">
                    <p>Created by</p>
                    <h3>Bajo Michael</h3>
                    <a href="https://bajo-michael.netlify.app/" className="text-white">
                      Portfolio <FaExternalLinkAlt className="inline" />
                    </a>
                  </div>
                </nav>
              ) : (
                <nav className="fixed top-0 left-[50%] translate-x-[-50%] min-h-10 md:h-16 w-[95vw] md:w-[80vw] mt-3 px-4 bg-black/70 md:bg-black/60 rounded-3xl md:rounded-full z-50 flex flex-wrap justify-between items-center">
                  <Link to="/" className="text-white font-bold md:text-2xl no-underline lavishly-yours-regular">Lumen Dining</Link>

                  <div className="items-center gap-6 text-sm md:text-base hidden md:flex">
                    <NavLinks />
                  </div>

                  <button className="text-white font-bold md:hidden" onClick={toggleNavBar}>
                    {isOpen ? <IoClose /> : <RxHamburgerMenu />}
                  </button>
                </nav>
              )}

              {/* ── Routes ───────────────────────────────────────────── */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </BrowserRouter>
        </CheckoutProvider>
      )}
    </>
  );
}

export default App;