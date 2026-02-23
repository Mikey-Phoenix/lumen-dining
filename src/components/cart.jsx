import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../components/checkout";
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { db, auth } from "../firebase";
import { doc, deleteDoc, updateDoc, deleteField, collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const clearCart = async (uid) => {
  if (!uid) {
    throw new Error("User ID is required to clear cart");
  }

  try {
    const cartRef = doc(db, "carts", uid); // or "users/{uid}/cart" if subcollection

    // Option A: Set items to empty array (recommended)
    await updateDoc(cartRef, {
      items: [],
      updatedAt: new Date(),           // optional: track when cart was cleared
      itemCount: 0,                    // optional: denormalized count
      total: 0                         // optional: if you keep a total
    });

    // Option B: If you want to completely remove the cart document (more nuclear)
    // await deleteDoc(cartRef);

    console.log("Cart cleared successfully for user:", uid);
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error; // let the caller handle/display the error
  }
};
export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCart, setOpenCart] = useState(false);
  // const [checkedOut, setCheckedOut] = useState(false);
  const { checkedOut, setCheckedOut } = useCheckout();
  const navigate = useNavigate();

  useEffect(() => {
    let unsub = () => {};

    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      unsub = onSnapshot(
        collection(db, "users", user.uid, "cart"),
        (snap) => {
          const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setCartItems(items);
          setLoading(false);
        }
      );
    });
    

    return () => {
      authUnsub();
      unsub();
    };
  }, []);

  // Reset checkout state if cart is closed or items change
  useEffect(() => {
    if (!openCart) setCheckedOut(false);
  }, [openCart]);

  async function removeFromCart(itemId) {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "cart", itemId));
  }

  async function handleCheckout() {
    const user = auth.currentUser;
    if (!user) return;

    // Delete every item doc in the cart subcollection
    const deletePromises = cartItems.map(item =>
      deleteDoc(doc(db, "users", user.uid, "cart", item.id))
    );
    await Promise.all(deletePromises);

    setCheckedOut(true);
    navigate("/Delivery");
  }

  return (
    <main>
      {/* Floating cart button */}
      <div className="fixed bottom-16 right-7 z-40">
        <div
          className="relative w-12 h-12 rounded-full bg-[#800020] border border-white flex justify-center items-center cursor-pointer transition-all ease-in-out duration-300 hover:bg-[#9b0127]"
          onClick={() => setOpenCart(true)}
        >
          <FaShoppingCart className="text-2xl text-white" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </div>

      {openCart && (
        <section className="w-[100vw] h-[100vh] fixed top-0 left-0 bg-black/40 z-50">
          <div className="relative w-[85vw] lg:w-[70vw] h-[90vh] top-10 left-[50%] translate-x-[-50%] overflow-y-scroll bg-gray-100 text-black rounded-xl">

            <div
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#800020] text-gray-100 text-xl font-extrabold flex justify-center items-center cursor-pointer"
              onClick={() => setOpenCart(false)}
            >
              <IoClose />
            </div>

            <h2 className="text-xl font-semibold p-5">Your Cart</h2>

            {loading ? (
              <p className="text-sm text-gray-400 px-5">Loading cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-sm text-gray-400 px-5">Your cart is empty.</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 p-3 w-fit mx-auto">
                  {cartItems.map(item => (
                    <div key={item.id}>
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="rounded-md shadow-md md:h-[15rem] md:w-[15rem] bg-white object-cover"
                          onError={e => { e.target.src = "/placeholder-food.png"; }}
                        />

                        {/* Icon toggles between delete and delivery based on checkout state */}
                        {checkedOut ? (
                          <TbTruckDelivery
                            className="absolute top-0 right-0 rounded-full text-white text-2xl p-1"
                            style={{ background: "#6B8E23" }}
                          />
                        ) : (
                          <MdDelete
                            className="absolute top-0 right-0 rounded-full text-white text-2xl bg-[#800020] p-1 cursor-pointer"
                            onClick={() => removeFromCart(item.id)}
                          />
                        )}
                      </div>

                      <div className="mt-2">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.type}</p>
                        {item.instructions && (
                          <p className="text-xs text-gray-400 italic">"{item.instructions}"</p>
                        )}
                        <p className="text-sm text-gray-500">₦{Number(item.price)?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-4 border-t mt-4">
                  <p className="font-semibold text-right text-lg">
                    Total: ₦{cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0).toLocaleString()}
                  </p>
                  <button
                    className="w-full mt-3 py-3 text-white rounded-full font-semibold transition-colors duration-300"
                    style={{ background: "#6B8E23" }}
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}

          </div>
        </section>
      )}
    </main>
  );
}