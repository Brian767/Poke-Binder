import { Route, Routes, BrowserRouter } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Cards from "./pages/Cards";
import Collection from "./pages/Collection";
import Binder from "./pages/Binder";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cards" element={<Cards />} />
          <Route path="collection" element={<Collection />} />
          <Route path="binder" element={<Binder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
