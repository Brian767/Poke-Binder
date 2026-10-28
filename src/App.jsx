import { Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";

function HomePage() {
  return (
    <main>
      <h1>Welcome to PokeBinder</h1>
      <p>Discover Pokémon cards and build your collection.</p>
    </main>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
