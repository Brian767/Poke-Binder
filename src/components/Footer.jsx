export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <p className="site-footer-brand">PokeBinder</p>
        <p>Keep your Pokémon card collection organized.</p>
        <small>
          Card data provided by <a href="https://tcgdex.dev">TCGdex</a>.
          <span> © {new Date().getFullYear()} PokeBinder</span>
        </small>
      </div>
    </footer>
  );
}
