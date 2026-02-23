import Maps from "../components/map";
import Footer from "../components/footer";
import black_bg from "../assets/black_bg.png";
import profile from "../assets/default_profile.png";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase"; // ← make sure this is your Firestore instance
// import { Alert } from "bootstrap";
// import { button } from "framer-motion/client";

function Delivery() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(""); // controlled value for the input
  const [loadingUser, setLoadingUser] = useState(true);
  const user = auth.currentUser;
  // Listen for auth state and load saved location from Firestore
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in → try to fetch their saved address/location
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            // Use 'address' or 'location' field — change field name if different
            setLocation(data.address || data.location || "");
          } else {
            setLocation(""); // no doc → empty
          }
        } catch (err) {
          console.error("Error fetching user location:", err);
          setLocation("");
        }
      } else {
        // No user signed in → clear input
        setLocation("");
      }
      setLoadingUser(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []); // run once on mount

  function unavailable() {
    alert("Sorry, this action is currently unavailable. Do not come back later.")
  }

  return (
    <main
      className="text-white" style={{backgroundImage: `url(${black_bg})`, backgroundPosition: "center", backgroundSize: "cover",}}>

      <div className="p-3 pt-5 md:flex md:min-h-[400px] md:max-h-[700px] md:flex-col lg:flex-row-reverse md:items-center">
        <Maps />

        {user ? (
          <section className="md:text-xl lg:text-lg border-b-2 md:border-b-0 py-4 md:min-w-[80vw] lg:min-w-[30vw] lg:w-[20vw] flex flex-col items-center">
            <img src={profile} className="h-[200px] w-[200px] p-0 rounded-full"/>
            <div className="w-[90%] mt-2 flex flex-wrap items-center">
              <p className="min-w-[50%]">John Delivery Guy</p>
              <p className="flex justify-around text-[#FFD700] min-w-[50%]"><FaStar /><FaStar /><FaStar /><FaStarHalfAlt /><FaRegStar /></p>
              <p className="min-w-[50%]">+234 000 000 000</p>
              <button className="py-3 px-12 rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-300 bg-[#80002088] disabled text-white" onClick={unavailable}>Change </button>
            </div>
          </section>

        ) : (
          <section className="md:text-xl lg:text-lg border-b-2 md:border-b-0 py-4 md:min-w-[80vw] lg:min-w-[30vw] lg:w-[20vw] flex flex-col items-center">
            <button className="py-3 px-12 rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-300 bg-[#800020] text-white" onClick={() => navigate("/signin")}>Log In</button>
          </section>

        )}
      </div>

      <section className="p-3 md:text-xl lg:text-lg md:flex">
        <div className="border-b-2 md:border-b-0 md:border-r-2 mt-3 md:pt-5 md:w-[50%] text-center">
          <p>Enter zip code, city or full address</p>

          <input
            className="block w-[80%] mx-auto my-4 p-2 md:px-4 rounded-lg bg-transparent border border-[#1F1F1F]" type="text" placeholder="Enter Location" value={location} onChange={(e) => setLocation(e.target.value)} disabled={loadingUser}/>

          <button
            className="no-underline disabled bg-[#80002088] text-white text-sm md:text-xl font-bold mb-3 py-2 px-20 ml-3 rounded-full cursor-pointer" onClick={unavailable}>SEARCH</button>
        </div>

        <div className="mt-5 text-center md:w-[50%]">
          <div className="flex lg:flex-col justify-between">
            <div>
              <h2 className="font-bold md:text-4xl lg:text-3xl">ADAMS MORGAN</h2>
              <a href="#" className="text-white">
                1654 Columbia Rd, Washington, DC 20009
              </a>
            </div>
            <div className="font-bold lg:pt-5">
              <p>Open 7 days a week!</p>
              <p>11:30 AM - 9 PM or until we sell out</p>
            </div>
          </div>

          <button className="relative bg-[#800020] text-white text-sm md:text-xl font-bold my-3 py-2 px-20 rounded-full cursor-pointer" onClick={() => {navigate("/Menu");}}>ORDER NOW</button>
        </div>
      </section>

      <Footer></Footer>
    </main>
  );
}

export default Delivery;