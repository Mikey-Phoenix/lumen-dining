import Footer from "../components/footer";
import black_bg from "../assets/black_bg.png";
import menu_bg from "../assets/menu-bg.jpg";
import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import Cart from '../components/cart';
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../firebase";
import FoodList from "../components/foodList";
import { db, auth } from "../firebase";
import { doc, setDoc, increment } from "firebase/firestore";
// import { onSnapshot, collection } from "firebase/firestore";


// <FaShoppingCart />



function Home() {
  // const [user, setUser] = useState(null);
  // const [authReady, setAuthReady] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(null);
  // const [openFoods, setOpenFoods] = useState(false);
  // const [price, setPrice] = useState(0);
  // const [type, setType] = useState("");
  // const [instructions, setInstructions] = useState("");

  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [openFoods, setOpenFoods] = useState(false);

  // Modal form fields — collected from the website
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setSelectedPrice(selectedItem.Price);
      setSelectedType("Regular");
    }
  }, [selectedItem]);

  // const uid = auth.currentUser.uid;
  async function addToCart() {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to add items to cart.");
    if (!selectedPrice || !selectedType) return alert("Please select a price and type.");

    const cartRef = doc(db, "users", user.uid, "cart", selectedItem.id);

    await setDoc(cartRef, {
      name: selectedItem.Name,
      imageUrl: selectedItem.imageURL,
      price: selectedPrice,
      type: selectedType,
      instructions: instructions || null,
      quantity: increment(1),
    }, { merge: true });

    console.log("Added to cart:", selectedItem);

    setSelectedPrice("");
    setSelectedType("");
    setInstructions("");
    setOpenFoods(false);
  }
  
  // ── Remove item from cart ─────────────────────────────────────────
  
  
  
 

  // useEffect(() => {
  //   async function fetchFoodItems() {
  //     try {
  //       const q = query(
  //         collection(db, "food-items"),
  //         where("Category", "==", "Main")
  //       );
  //       const snap = await getDocs(q);
  //       const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setFoodItems(items);
  //     } catch (err) {
  //       console.error("Error fetching food items:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   if (category) fetchFoodItems(); // only fetch when category is defined
  //   // fetchFoodItems();
  // }, [category]);

  // if (loading) {
  //   return (
  //     <p className="text-sm text-gray-400 text-center py-10">
  //       Loading menu…
  //     </p>
  //   );
  // }

  // if (foodItems.length === 0) {
  //   return (
  //     <p className="text-sm text-gray-400 text-center py-10">
  //       No items available right now.
  //     </p>
  //   );
  // }

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundImage: `url(${black_bg})`, backgroundPosition: 'center', backgroundSize: 'cover'}}>
      <div className="relative h-48 text-white" style={{ backgroundImage: `url(${menu_bg})`, backgroundPosition: 'center', backgroundSize: 'cover'}}>
        <div className="absolute top-0 left-0 h-48 w-screen bg-black/40 flex flex-col justify-end ">
          <h1 className="ml-5 text-4xl">MENU</h1>
          <p className="ml-5 text-sm md:text-base">You can only place scheduled pickup orders. The earliest pickup time is Today, 2:30 PM GMT-1</p>
        </div>
      </div>

      <section className="p-4">
        
        <h3 className="mt-5 text-white text-3xl">Main Menu</h3>
        <FoodList category="Main" setOpenFoods={setOpenFoods} setSelectedItem={setSelectedItem} className="" />
        <h3 className="mt-5 text-white text-3xl">Snacks</h3>
        <FoodList category="Snacks" setOpenFoods={setOpenFoods} setSelectedItem={setSelectedItem} className="" />
        <h3 className="mt-5 text-white text-3xl">Drinks</h3>
        <FoodList category="Drinks" setOpenFoods={setOpenFoods} setSelectedItem={setSelectedItem} className="" />

      </section>
      {
        openFoods &&
        <section className="w-[100vw] h-[100vh] fixed top-0 left-0 bg-black/40 z-50">
          <div className="relative w-[85vw] lg:w-[50vw] h-[90vh] top-10 left-[50%] translate-x-[-50%] overflow-y-scroll bg-gray-100 text-black rounded-xl">
              <img className="w-[100%] rounded-xl" src={selectedItem.imageURL} />
              <div className="px-3">
                  <div className="pt-3 pb-1 border-b-2 border-black">
                      <h2>{selectedItem.Name} - {selectedItem.Category}</h2>
                      <p>{selectedItem.Description}</p>
                  </div>
                  <div className="pt-3 pb-3 border-b-2 border-black">
                      <h2>Portion</h2>
                      <p>Required* Please select one</p>
                      <div className="md:flex lg:justify-between">
                          <select className=" shadow-md rounded-xl bg-gray-100 pl-2 pr-2 mb-2 h-12 w-full md:w-full cursor-pointer" value={selectedPrice} onChange={e => setSelectedPrice(e.target.value)}>
                            <option className="flex justify-between items-center border" value={selectedItem.Price}><p>1 Serving</p>------------------------<p>₦{selectedItem.Price}</p></option>
                            <option className="flex justify-between items-center border" value={selectedItem.Price * 2}><p>2 Servings</p>------------------------<p>₦{selectedItem.Price * 2}</p></option>
                            <option className="flex justify-between items-center border" value={selectedItem.Price * 3}><p>4 Servings</p>------------------------<p>₦{selectedItem.Price * 3}</p></option>
                          </select>
                      </div>
                  </div>
                  <div className="pt-3 pb-3 border-b-2 border-black">
                      <h2>Type Choice</h2>
                      <p>Required* Please select one</p>
                      <div className="md:flex lg:justify-between">
                          <select className=" shadow-md rounded-xl bg-gray-100 pl-2 pr-2 mb-2 h-12 w-full md:w-full lg:w-[48%] cursor-pointer" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                            <option className="flex justify-between items-center border" selected value="Regular"><p>Regular</p></option>
                            <option className="flex justify-between items-center border" value="Vegan"><p>Vegan</p></option>
                          </select>
                      </div>
                  </div>
                  <div className="pt-3 pb-1 border-black">
                      <h2>Special Instructions</h2>
                      <textarea className="flex justify-between shadow-lg rounded-xl bg-transparent w-full h-20 md:h-30 lg:h-40 p-3 mb-3" name="" id="" placeholder="Additional Instructions may charge" value={instructions} onChange={e => setInstructions(e.target.value)}></textarea>
                  </div>
              </div>
              <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#800020] text-white text-xl font-extrabold flex justify-center items-center cursor-pointer" onClick={()=>{
                setOpenFoods(false);
                setSelectedPrice("");
                setSelectedType("");
                setInstructions("");
              }}><IoClose /></div>
              <div className="w-full h-16 rounded-bl-xl rounded-br-xl bg-gray-100 flex justify-between items-center px-2 md:px-4">
                <button className="text-white bg-[#800020] border h-10 py-2 px-4 ml-3 rounded-full cursor-pointer" onClick={addToCart} disabled={!selectedPrice || !selectedType}>Cart <FaShoppingCart className="text-sm inline" /></button>
                <button className="text-white bg-[#6B8E23] border h-10 py-2 px-4 ml-3 rounded-full cursor-pointer" onClick={()=>{navigate("/Delivery")}}>Deliver Now <TbTruckDelivery className="text-sm inline" /></button>
              </div>
          </div>
        </section>
        // <Foods></Foods>
      }
      <Cart></Cart>
      <Footer></Footer>
    </main>
  );
}

// function FoodCard({ item, index, onClick }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 100 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, ease: "easeInOut", delay: index * 0.05 }}
//       viewport={{ once: true }}
//       className="w-[41vw] md:mb-5 pb-2 rounded-xl md:flex bg-gray-100 text-black cursor-pointer transition-all ease-in-out hover:bg-white hover:scale-[1.01]"
//       onClick={onClick}
//     >
//       <img
//         className="w-max md:w-[40%] md:max-h-[150px] md:ml-1 md:mt-1 lg:ml-2 lg:mt-2 rounded-xl object-cover"
//         src={item.imageURL}
//         alt={item.Name}
//         // fallback if image fails to load
//         onError={e => { e.target.src = {food_item}; }}
//       />
//       <div className="md:flex-col md:items-center">
//         <h4 className="m-2 text-2xl">{item.Name}</h4>
//         <p className="hidden md:block m-2 font-semibold text-sm">
//           {item.Description}
//         </p>
//         <p className="m-2 font-semibold text-sm">
//           ₦{item.Price?.toLocaleString()}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

export default Home;