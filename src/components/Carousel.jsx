import { useEffect } from "react";
import { useState } from 'react';
import { Link } from "react-router-dom";

export default function Carousel({
    children: slides,
    autoSlide = false,
    autoSlideInterval = 10000,
}) {
    const [curr, setCurr] = useState(0)

    // const prev = () => 
    //     setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
    const next = () => 
        setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))

    useEffect (() => {
        if (!autoSlide) return
        const slideInterval  = setInterval(next, autoSlideInterval)
        return ()=> clearInterval(slideInterval)
    }, [])
    return (
        // overflow-hidden
        <div className="overflow-hidden w-[100vw] h-[50vh] md:h-[100vh] md:max-h-[600px] relative">
            <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${curr * 100}%)` }}>{slides}</div>
            <div className="absolute inset-0 flex items-center justify-between p-4">
                {/* <button onClick={prev} className="bg-white p-1 rounded-full">L</button>
                <button onClick={next} className="bg-white p-1 rounded-full">R</button> */}
            </div>

            <div className="absolute top-0 left-0 h-[50vh] md:h-[100vh] md:max-h-[600px] w-[300vw] flex justify-between items-center" style={{ transform: `translateX(-${curr * 100}vw)` }}>
                <div className="h-[50vh] md:h-[100vh] w-[100vw] flex justify-center items-center bg-black/40 transition ease-out duration-500">
                    <div className="w-[90vw] md:w-[70vw] lg:w-[50vw] text-center text-white">
                        <h1 className="text-3xl md:text-6xl mb-4">Chef's Special</h1>
                        <p className="text-sm md:text-xl mb-4">Every month we feature a new fancy lumen dining chef special. Don’t miss out on October’s Special seasoned Jollof Rice.</p>
                        <Link to="/" className="no-underline text-white border py-2 px-4 mr-3 rounded-full cursor-pointer">Learn More</Link>
                        <Link to="/Menu" className="no-underline bg-white text-black border py-2 px-4 ml-3 rounded-full cursor-pointer">Order Now</Link>
                    </div>
                </div>
                <div className="h-[60vh] md:h-[100vh] w-[100vw] flex justify-center items-center bg-black/40 transition ease-out duration-500">
                    <div className="w-[90vw] md:w-[70vw] lg:w-[50vw] text-center text-white">
                        <h1 className="text-3xl md:text-6xl mb-4">Event's Catering</h1>
                        <p className="text-sm md:text-xl mb-4"> Got a celebration coming up and need a hand-or maybe you just want a whole platter of ribs? No matter what type of event, size or style, we got you. Enjoy our catering team at your next event.</p>
                        <Link to="/" className="no-underline text-white border py-2 px-4 mr-3 rounded-full cursor-pointer">Learn More</Link>
                        <Link to="/Contact" className="no-underline bg-white text-black border py-2 px-[35px] ml-3 rounded-full cursor-pointer">Catering</Link>
                    </div>
                </div>
                <div className="h-[60vh] md:h-[100vh] w-[100vw] flex justify-center items-center bg-black/40">
                    <div className="w-[90vw] md:w-[70vw] lg:w-[50vw] text-center text-white">
                        <h1 className="text-3xl md:text-6xl mb-4">Special Sauce</h1>
                        <p className="text-sm md:text-xl mb-4"> It’s going to be a good Lumen Dining fall, y’all. The Pit Beef straight outta’ B-more is back, along with a new Shrimp Banh Mi, Oxtail Empanadas and Smoked Garlic Hummus that is super yummus</p>
                        <Link to="/" className="no-underline text-white border py-2 px-4 mr-3 rounded-full cursor-pointer">Learn More</Link>
                        <Link to="/Menu" className="no-underline bg-white text-black border py-2 px-4 ml-3 rounded-full cursor-pointer">See Specials</Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 left-0 flex justify-center items-center">
                <div className="bg-gray-100 w-fit p-3 rounded-tr-lg rounded-tl-lg">
                    <div className="flex items-center justify-center gap-3 md:gap-10">
                        {slides.map((_, i) => (
                            <div className={`
                                transition-all w-2 md:w-3 h-2 md:h-3 bg-black rounded-full
                                ${curr === i ? "p-1 md:p-2" : "bg-opacity-50"}
                            `}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}