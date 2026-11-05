import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <div className="site-footer-about">
          <Link className="site-footer-brand" to="/">PIKA BNDR</Link>
          <p>A simple place to search, collect, and organize Pokémon cards.</p>
        </div>
        <nav className="site-footer-links" aria-label="Footer navigation">
          <Link to="/cards">Search cards</Link>
          <Link to="/collection">Collection</Link>
          <Link to="/binder">Binder</Link>
        </nav>
        <div className="site-footer-meta">
          <small>Card data provided by <a href="https://tcgdex.dev" target="_blank" rel="noreferrer">TCGdex</a>.</small>
          <small>© {new Date().getFullYear()} PIKA BNDR</small>
        </div>
      </div>
    </footer>
  );
}
