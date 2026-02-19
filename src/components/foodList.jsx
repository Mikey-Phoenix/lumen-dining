// FoodList.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import food_item from "../assets/food-item.jpg";


export default function FoodList({ category, setOpenFoods, setSelectedItem }) {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFoodItems() {
      try {
        const q = query(
          collection(db, "food-items"),
          where("Category", "==", category)
        );
        const snap = await getDocs(q);
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFoodItems(items);
      } catch (err) {
        console.error("Error fetching food items:", err);
      } finally {
        setLoading(false);
      }
    }

    if (category) fetchFoodItems();
  }, [category]);

  if (loading) return <p className="text-sm text-gray-400 py-4">Loading...</p>;

  if (foodItems.length === 0) return <p className="text-sm text-gray-400 py-4">No items found.</p>;

  return (
    <div className="mt-3 md:ml-5 grid grid-cols-2 gap-4">
      {foodItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", delay: index * 0.05 }}
          viewport={{ once: true }}
          className="w-[41vw] md:mb-5 pb-2 rounded-xl md:flex bg-gray-100 text-black cursor-pointer transition-all ease-in-out hover:bg-white hover:scale-[1.01]"
          onClick={() => {
            setSelectedItem(item);
            setOpenFoods(true);
          }}
        >
          <img
            className="w-max md:w-[40%] md:max-h-[150px] md:ml-1 md:mt-1 lg:ml-2 lg:mt-2 rounded-xl object-cover"
            src={item.imageURL}
            alt={item.Name}
            onError={e => { e.target.src = {food_item}; }}
          />
          <div className="md:flex-col md:items-center">
            <h4 className="m-2 text-2xl">{item.Name}</h4>
            <p className="hidden md:block m-2 font-semibold text-sm">{item.Description}</p>
            <p className="m-2 font-semibold text-sm">₦{item.Price?.toLocaleString()}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}