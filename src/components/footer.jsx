import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";

export default function Footer() {
    return (
        // <>
        <footer className="bg-[#1F1F1F] h-[40vh] lg:h-[30vh] text-white p-4 flex flex-col md:flex-row items-center justify-evenly text-center">
            <div className="flex flex-col items-center md:block">
                <h3 className=" w-fit text-4xl lg:text-6xl lavishly-yours-regular">Lumen Dining</h3>
                <p className=" w-fit text-xs lg:text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa voluptate officia expedita.</p>
            </div>
            <div className="flex justify-between w-[80vw] max-w-[300px] text-sm">
                <Link className="no-underline text-[#595959] transition ease-in-out duration-300 hover:text-[#9b0127]" to="/">ABOUT</Link>
                <Link className="no-underline text-[#595959] transition ease-in-out duration-300 hover:text-[#9b0127]" to="/Contact">CONTACT</Link>
                <Link className="no-underline text-[#595959] transition ease-in-out duration-300 hover:text-[#9b0127]" to="/Delivery">LOCATION</Link>
                <Link className="no-underline text-[#595959] transition ease-in-out duration-300 hover:text-[#9b0127]" to="/Contact">CAREER</Link>
            </div>
            <div className="flex justify-evenly text-3xl w-[80vw] max-w-[400px]">
                <Link className="no-underline text-white transition ease-in-out duration-300 hover:text-[#9b0127]" to="https://www.instagram.com/fisayobajo?igsh=aTd0OGJwejY4Mnk3"><FaInstagram /></Link>
                <Link className="no-underline text-white transition ease-in-out duration-300 hover:text-[#9b0127]" to="https://x.com/PhoenixCode4?t=7kvHNCsg0oNuE8nrSGzEjg&s=09"><FaXTwitter /></Link>
                <Link className="no-underline text-white transition ease-in-out duration-300 hover:text-[#9b0127]" to="tel:+2348168562130"><FaWhatsapp /></Link>
                <Link className="no-underline text-white transition ease-in-out duration-300 hover:text-[#9b0127]" to="mailto:bajomichael06@gmail.com"><FaEnvelope /></Link>
            </div>
        </footer>

        // </>
    )
}