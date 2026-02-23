import Footer from "../components/footer";
import black_bg from "../assets/black_bg.png";
import menu_bg from "../assets/menu-bg.jpg";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { IoFilter } from "react-icons/io5";
import { GiMeal } from "react-icons/gi";
import { PiHamburgerFill } from "react-icons/pi";
import { RiDrinks2Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import Cart from "../components/cart";
import FoodList from "../components/foodList";
import { db, auth } from "../firebase";
import {
  doc,
  collection,
  getDocs,
  setDoc,
  increment,
} from "firebase/firestore";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Menu() {
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [openFoods, setOpenFoods] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedType, setSelectedType] = useState("Regular");
  const [instructions, setInstructions] = useState("");

  const [filter, setFilter] = useState(false);
  const [filterItem, setFilterItem] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const [searchOpen, setSearchOpen] = useState(false);

  // Cache all food items so we only fetch from Firestore once per session
  const allItemsCache = useRef(null);

  async function getAllItems() {
    if (allItemsCache.current) return allItemsCache.current;
    const snapshot = await getDocs(collection(db, "food-items"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    allItemsCache.current = data;
    return data;
  }

  function toggleSearch() {
    setSearchOpen((prev) => !prev);
  }
  // Client-side "contains" search — works for any substring, not just prefix
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      try {
        const lowerSearch = searchTerm.trim().toLowerCase();
        const allItems = await getAllItems();

        const filtered = allItems.filter((item) => {
          const nameMatch = item.Name?.toLowerCase().includes(lowerSearch);
          const categoryMatch =
            filterItem === "all" ||
            item.Category?.toLowerCase() === filterItem.toLowerCase();
          return nameMatch && categoryMatch;
        });

        setResults(filtered);
        console.log("Search results:", filtered);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterItem]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedPrice(selectedItem.Price);
      setSelectedType("Regular");
    }
  }, [selectedItem]);

  function toggleFilter() {
    setFilter((prev) => !prev);
  }

  function toggleFilterItem(item) {
    setFilterItem((prev) => (prev === item ? "all" : item));
  }

  function closeModal() {
    setOpenFoods(false);
    setSelectedPrice("");
    setSelectedType("Regular");
    setInstructions("");
  }

  async function addToCart() {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add items to cart.");
      return navigate("/signin");
    }
    if (!selectedPrice || !selectedType)
      return alert("Please select a price and type.");

    const cartRef = doc(db, "users", user.uid, "cart", selectedItem.id);

    await setDoc(
      cartRef,
      {
        name: selectedItem.Name,
        imageUrl: selectedItem.imageURL,
        price: selectedPrice,
        type: selectedType,
        instructions: instructions || null,
        quantity: increment(1),
      },
      { merge: true }
    );

    console.log("Added to cart:", selectedItem);
    closeModal();
  }

  function deliver() {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to place an order.");
      return navigate("/signin");
    }
    navigate("/Delivery");
  }

  function renderMenuSections() {
    if (filterItem === "all") {
      return (
        <>
          <h3 className="mt-5 text-white text-3xl" id="main">Main Menu</h3>
          <FoodList category="Main" setOpenFoods={setOpenFoods} setSelectedItem={setSelectedItem} />
          <h3 className="mt-5 text-white text-3xl" id="snacks">Snacks</h3>
          <FoodList category="Snacks" setOpenFoods={setOpenFoods} setSelectedItem={setSelectedItem} />
          <h3 className="mt-5 text-white text-3xl" id="drinks">Drinks</h3>
          <FoodList category="Drinks" setOpenFoods={setOpenFoods} setSelectedItem={setSelectedItem} />
        </>
      );
    }

    const categoryMap = {
      main: { label: "Main Menu", category: "Main", id: "main" },
      snacks: { label: "Snacks", category: "Snacks", id: "snacks" },
      drinks: { label: "Drinks", category: "Drinks", id: "drinks" },
    };

    const { label, category, id } = categoryMap[filterItem];
    return (
      <>
        <h3 className="mt-5 text-white text-3xl" id={id}>{label}</h3>
        <FoodList category={category} setOpenFoods={setOpenFoods} setSelectedItem={setSelectedItem} />
      </>
    );
  }

  const filterButtons = [
    { key: "main", icon: <GiMeal className="text-2xl" /> },
    { key: "snacks", icon: <PiHamburgerFill className="text-2xl" /> },
    { key: "drinks", icon: <RiDrinks2Fill className="text-2xl" /> },
  ];

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundImage: `url(${black_bg})`, backgroundPosition: "center", backgroundSize: "cover" }}
    >
      {/* Header */}
      <div
        className="relative h-48 text-white"
        style={{ backgroundImage: `url(${menu_bg})`, backgroundPosition: "center", backgroundSize: "cover" }}
      >
        <div className="absolute top-0 left-0 h-48 w-screen bg-black/40 flex flex-col justify-end">
          <h1 className="ml-5 text-4xl">MENU</h1>
          <p className="ml-5 text-sm md:text-base">
            You can only place scheduled pickup orders. The earliest pickup time is Today, 2:30 PM GMT-1
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <section className="p-4">
        {searchTerm.trim() && results.length > 0 ? (
          <>
            <h3 className="mt-5 text-white text-3xl">Search Results for "{searchTerm}"</h3>
            <FoodList data={results} setOpenFoods={setOpenFoods} setSelectedItem={setSelectedItem} />
          </>
        ) : searchTerm.trim() && results.length === 0 ? (
          <h3 className="mt-5 text-white text-3xl">No results found for "{searchTerm}"</h3>
        ) : (
          renderMenuSections()
        )}
      </section>

      {/* Item Modal */}
      {openFoods && selectedItem && (
        <section className="w-[100vw] h-[100vh] fixed top-0 left-0 bg-black/40 z-50">
          <div className="relative w-[85vw] lg:w-[50vw] h-[90vh] top-10 left-[50%] translate-x-[-50%] overflow-y-scroll bg-gray-100 text-black rounded-xl">
            <img className="w-[100%] rounded-xl" src={selectedItem.imageURL} alt={selectedItem.Name} />

            <div className="px-3">
              <div className="pt-3 pb-1 border-b-2 border-black">
                <h2>{selectedItem.Name} - {selectedItem.Category}</h2>
                <p>{selectedItem.Description}</p>
              </div>

              <div className="pt-3 pb-3 border-b-2 border-black">
                <h2>Portion & Proteins</h2>
                <p>Required* Please select one</p>
                <select
                  className="shadow-md rounded-xl bg-gray-100 pl-2 pr-2 mb-2 h-12 w-full cursor-pointer"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}>
                  <option value={selectedItem.Price}>1 Serving — ₦{selectedItem.Price}</option>
                  <option value={selectedItem.Price * 2}>2 Servings — ₦{selectedItem.Price * 2}</option>
                  <option value={selectedItem.Price * 3}>3 Servings — ₦{selectedItem.Price * 3}</option>
                </select>
                {/* <select
                  className="shadow-md rounded-xl bg-gray-100 pl-2 pr-2 mb-2 h-12 w-full lg:w-[48%] cursor-pointer"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}>
                  <option value={selectedItem.Price}>Beef — ₦{selectedItem.Price}</option>
                  <option value={selectedItem.Price * 2}>Chicken — ₦{selectedItem.Price * 2}</option>
                  <option value={selectedItem.Price * 3}>Turkey — ₦{selectedItem.Price * 3}</option>
                  <option value={selectedItem.Price * 3}>Egg — ₦{selectedItem.Price * 3}</option>
                </select> */}
              </div>

              <div className="pt-3 pb-3 border-b-2 border-black">
                <h2>Type Choice</h2>
                <p>Required* Please select one</p>
                <select
                  className="shadow-md rounded-xl bg-gray-100 pl-2 pr-2 mb-2 h-12 w-full cursor-pointer"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="Regular">Regular</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div className="pt-3 pb-1">
                <h2>Special Instructions</h2>
                <textarea
                  className="shadow-lg rounded-xl bg-transparent w-full h-20 md:h-32 lg:h-40 p-3 mb-3"
                  placeholder="Additional instructions may incur charges"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>

            <div
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#800020] text-white text-xl font-extrabold flex justify-center items-center cursor-pointer"
              onClick={closeModal}
            >
              <IoClose />
            </div>

            <div className="w-full h-16 rounded-bl-xl rounded-br-xl bg-gray-100 flex justify-between items-center px-2 md:px-4">
              <button
                className="text-white bg-[#800020] border h-10 py-2 px-4 ml-3 rounded-full cursor-pointer disabled:opacity-50"
                onClick={addToCart}
                disabled={!selectedPrice || !selectedType}
              >
                Cart <FaShoppingCart className="text-sm inline" />
              </button>
              <button
                className="text-white bg-[#6B8E23] border h-10 py-2 px-4 ml-3 rounded-full cursor-pointer"
                onClick={deliver}
              >
                Deliver Now <TbTruckDelivery className="text-sm inline" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filter Toggle */}
      <div
        className="fixed bottom-32 right-7 w-12 h-12 rounded-full bg-gray-100 border border-[#800020] flex justify-center items-center cursor-pointer"
        onClick={toggleFilter}
      >
        <IoFilter className="text-2xl text-[#800020]" />
      </div>

      {/* Filter Panel */}
      {filter && (
        <div className="fixed bottom-48 right-8">
          {filterButtons.map(({ key, icon }) => {
            const isActive = filterItem === key;
            return (
              <div
                key={key}
                className={`w-10 h-10 my-1 lg:my-2 rounded-full flex justify-center items-center cursor-pointer transition-all ease-in-out duration-300 ${
                  isActive
                    ? "bg-[#800020] border border-white text-white"
                    : "bg-gray-100 border border-[#800020] text-[#800020]"
                }`}
                onClick={() => toggleFilterItem(key)}
              >
                {icon}
              </div>
            );
          })}

          <div className="h-10 relative">
            {searchOpen ? (
              <>
                <input
                  type="text"
                  className="absolute left-[-520%] w-[200px] h-full bg-gray-100 text-black rounded-full px-3 transition-all ease-in-out duration-300"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="w-10 h-full my-1 lg:my-2 rounded-full border border-white bg-[#800020] flex justify-center items-center cursor-pointer transition-all ease-in-out duration-300" onClick={toggleSearch}>
                  <FaSearch className="text-xl text-white" />
                </div>
              </>
            ) : (
                <div className="w-10 h-full my-1 lg:my-2 rounded-full bg-gray-100 border border-[#800020] flex justify-center items-center cursor-pointer" onClick={toggleSearch}>
                  <FaSearch className="text-xl text-[#800020]" />
                </div>
            ) }
          </div>
        </div>
      )}

      <Cart />
      <Footer />
    </main>
  );
}

export default Menu;