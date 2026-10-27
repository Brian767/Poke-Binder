export default function Navbar() {
  return (
    <nav id="nav" aria-label="Main navigation">
      <div className="nav-padding">
        <a className="navLink" href="/" aria-label="PokeBinder home">
          PokeBinder
        </a>
        <div id="navLinks">
          <a className="navLink" href="/">
            Home
          </a>
          <a className="navLink" href="/binders">
            Binders
          </a>
          <a className="navLink" href="/cards">
            Cards
          </a>
        </div>
      </div>
    </nav>
  );
}
