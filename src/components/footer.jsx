import { Link } from "react-router-dom";

export default function Footer() {
    return (
        // <>
        <footer className="bg-[#1F1F1F] h-10 md:h-16 flex justify-evenly items-center text-base md:text-xl">
            <Link className="no-underline text-white" to="/">ABOUT</Link>
            <Link className="no-underline text-white" to="/Contact">CONTACT</Link>
            <Link className="no-underline text-white" to="/">LOCATION</Link>
            <Link className="no-underline text-white" to="/">CAREER</Link>
        </footer>

        // </>
    )
}