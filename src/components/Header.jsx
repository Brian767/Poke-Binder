import React from "react";
import { NavLink, Link } from "react-router";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen((open) => !open);
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

        <ul id="navLinks" className={isOpen ? "open" : ""}>
          <li className="menu-close-item">
            <button
              type="button"
              className="menu-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
            >
              <span className="bar-close"></span>
              <span className="bar-close"></span>
            </button>
          </li>
          <li>
            <NavLink className="navLink" to="/" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="navLink" to="/binders" onClick={() => setIsOpen(false)}>
              Binders
            </NavLink>
          </li>
          <li>
            <NavLink className="navLink" to="/cards" onClick={() => setIsOpen(false)}>
              Cards
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
