import Footer from "../components/footer";
import Maps from "../components/map";
import black_bg from "../assets/black_bg.png";
import Cart from '../components/cart';

function Home() {
  return (
    <main className="text-white p-3 min-h-screen md:flex md:flex-col lg:flex-row-reverse md:items-center" style={{ backgroundImage: `url(${black_bg})`, backgroundPosition: 'center', backgroundSize: 'cover'}}>
      {/* <img src={map} className="md:w-full lg:w-[70vw]"/> */}
      <Maps></Maps>
      <section className=" md:text-xl lg:text-lg md:min-w-[80vw] lg:min-w-[30vw] lg:w-[20vw]">
        <div className="border-b-2 border-b-white mt-3 md:pt-5">
          <p>Enter zip code, city or full address</p>
          <input className="block w-[60vw] lg:w-[25vw] my-4 p-2 md:px-4 rounded-lg bg-transparent border border-[#1F1F1F] md:text-xl" type="text" placeholder="Enter Location"/>
          <button className="no-underline bg-[#800020] text-white text-sm md:text-xl font-bold mb-3 py-2 px-20 ml-3 rounded-full cursor-pointer">SEARCH</button>
        </div>
        <div className="mt-5">
          <div className="flex lg:flex-col justify-between">
            <div>
              <h2 className="font-bold md:text-4xl lg:text-3xl">ADAMS MORGAN</h2>
              <a href="#" className="text-white">1654 Columbia Rd, Washington, DC 20009</a>
            </div>
            <div className="font-bold lg:pt-5">
              <p>Open 7 days a week!</p>
              <p>11:30 AM - 9 PM or until we sell out</p>
            </div>
          </div>
          <button className="relative bg-[#800020] text-white text-sm md:text-xl font-bold my-3 !mx-auto py-2 px-20 left-[50%] translate-x-[-50%] rounded-full cursor-pointer">ORDER NOW</button>
        </div>
      </section>
      {/* <Footer></Footer> */}
    </main>
  );
}

export default Home;