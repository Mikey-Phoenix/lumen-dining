import Carousel from "../components/Carousel";
import Cart from '../components/cart';
import Footer from "../components/footer";
import pic1 from "../assets/carousel-img-one.jpg";
import pic2 from "../assets/carousel-img-two.jpg";
import pic3 from "../assets/carousel-img-three.jpg";
import drinks from "../assets/drink.jpg";
import burger from "../assets/burger.jpg";
import black_bg from "../assets/black_bg.png";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

const slides = [
  pic1,
  pic2,
  pic3,
]

export default function Home() {
  return (
    <main className="App overflow-hidden">
      <div className="max-w-lg">
        <Carousel autoSlide={true}>
          {slides.map((s)=>(
            <img src={s} alt="" className="h-[50vh] md:h-full"/>
          ))}
          {/* style={{ width: '100vw', height: '100%'}} */}
        </Carousel>
      </div>

      <section className="my-5 px-3 md:px-5 md:flex justify-around">
        <motion.div
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        viewport={{ once: true }}   // animates only the first time it enters view
        >
          <div className="w-fill h-[30vh] md:h-[40vh] md:max-h-[400px] lg:h-[60vh] mb-1 bg-cover bg-no-repeat rounded" style={{ backgroundImage: `url(${burger})`, backgroundPosition: 'center'}}></div>
          <h1 className="text-2xl text-center md:!text-left md:text-5xl lg:text-6xl mb-2">SPECIALS</h1>
          <p className="md:w-[40vw] text-base text-center md:text-left text-[#595959]">Pitmaster Rob is always up to something! Check out our rotating specialty sandwiches and limited drops, including a Limited Time Only Monthly Chef's Special that will leave you craving for more!</p>
          <Link to="/Menu" className="no-underline border border-white rounded-full bg-[#800020]  text-white text-lg w-full h-10 md:h-14 mb-5 md:mb-0 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#9b0127]">Order Now</Link>
        </motion.div>
        <motion.div
        initial={{ opacity: 0, x: 200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        viewport={{ once: true }}>
          <div className="md:w-[40vw] h-[30vh] md:h-[40vh] md:max-h-[400px] lg:h-[60vh] mb-1 bg-cover bg-no-repeat rounded" style={{ backgroundImage: `url(${drinks})`, backgroundPosition: 'center'}}></div>
          <h1 className="text-2xl text-center md:!text-left md:text-5xl lg:text-6xl mb-2">DRINKS</h1>
          <p className="md:w-[40vw] text-base text-center md:text-left text-[#595959]">Pitmaster Rob is always up to something! Check out our rotating specialty sandwiches and limited drops, including a Limited Time Only Monthly Chef's Special that will leave you craving for more!</p>
          <Link to="/Menu" className="no-underline border border-white rounded-full bg-[#800020] text-white text-lg w-full h-10 md:h-14 mb-5 md:mb-0 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#9b0127]">Order Now</Link>
        </motion.div>
      </section>

      <section className="bg-[#1F1F1F] p-5 text-white relative overflow-hidden" style={{ backgroundImage: `url(${black_bg})`, backgroundPosition: 'top', backgroundRepeat: 'repeat', backgroundSize: 'cover'}}>
        {/* <div className="absolute top-40 right-0 w-[100vw] h-96 bg-[#ABABAB] skew-y-[-20deg] opacity-[10%]"></div> */}
        <div className="md:flex justify-between mb-5">
          <h1 className="text-2xl block md:hidden">CATERING</h1>
          <motion.div
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          viewport={{ once: true }} className="md:w-[45vw] h-[30vh] lg:h-[50vh] md:mr-1 bg-cover bg-no-repeat rounded" style={{ backgroundImage: `url(${drinks})`, backgroundPosition: 'center'}}></motion.div>
          <motion.div
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          viewport={{ once: true }} className="md:flex flex-col justify-between">
            <h1 className="text-5xl lg:text-6xl hidden md:block">CATERING</h1>
            <p className="md:w-[40vw] my-3 text-base md:text-xl">Pitmaster Rob is always up to something! Check out our rotating specialty sandwiches and limited drops, including a Limited Time Only Monthly Chef's Special that will leave you craving for more!</p>
            <Link to="/Menu" className="no-underline rounded-full bg-[#800020]  text-white text-lg w-full h-10 md:h-14 mb-5 md:mb-0 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#9b0127]">Order Now</Link>
          </motion.div>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-between">
          <motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          viewport={{ once: true }} className="flex flex-col justify-between">
            <h1 className="text-5xl lg:text-6xl hidden md:block">MENU</h1>
            <p className="md:w-[40vw] my-3 text-base md:text-xl">Pitmaster Rob is always up to something! Check out our rotating specialty sandwiches and limited drops, including a Limited Time Only Monthly Chef's Special that will leave you craving for more!</p>
            <Link to="/Menu" className="no-underline rounded-full bg-[#800020]  text-white text-lg w-full h-10 md:h-14 mb-5 md:mb-0 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#9b0127]">Order Now</Link>
          </motion.div>
          <motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          viewport={{ once: true }} className="md:w-[45vw] h-[30vh] lg:h-[50vh] md:mr-1 bg-cover bg-no-repeat rounded" style={{ backgroundImage: `url(${burger})`, backgroundPosition: 'center'}}></motion.div>
          <h1 className="text-2xl block md:hidden">MENU</h1>
        </div>
      </section>

      <section className="bg-[#800020]">
        <div className="relative w-screen h-10 md:h-28 overflow-hidden flex items-center">
          <div className="relative w-full h-10 md:h-28 flex items-center overflow-hidden">
            <div className="absolute text-3xl md:text-5xl font-bold flex items-center gap-32 animate-scroll whitespace-nowrap">
              <div>SPONSOR</div>
              <div>SPONSOR</div>
              <div>SPONSOR</div>
              <div>SPONSOR</div>
              <div>SPONSOR</div>
              <div>SPONSOR</div>
              <div>SPONSOR</div>
              <div>SPONSOR</div>
              <div>SPONSOR</div>
              <div>SPONSOR</div>
            </div>
            
            <style>{`
              @keyframes scroll {
                0% {
                  transform: translateX(-50%);
                }
                100% {
                  transform: translateX(0%);
                }
              }
              
              .animate-scroll {
                animation: scroll 20s linear infinite;
              }
            `}</style>
          </div>
        </div>
      </section>

      <Cart></Cart>

      <Footer></Footer>
      
    </main>
  )
}