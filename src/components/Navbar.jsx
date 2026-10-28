import React from "react";
import { NavLink, Link } from "react-router";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav id="nav" aria-label="Main navigation">
      <div className="nav-padding">
        <Link className="navLink" to="/" aria-label="PokeBinder home">
          PokeBinder
        </Link>
        <button
          type="button"
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="navLinks"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {isOpen && (
          <ul id="navLinks" className={isOpen ? "open" : ""}>
            <button
              type="button"
              className={`hamburger ${isOpen ? "open" : ""}`}
              onClick={toggleMenu}
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isOpen}
              aria-controls="navLinks"
            >
              <span >X</span>
            </button>
            <li>
              <NavLink className="navLink " to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className="navLink" to="/binders">
                Binders
              </NavLink>
            </li>
            <li>
              <NavLink className="navLink" to="/cards">
                Cards
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
