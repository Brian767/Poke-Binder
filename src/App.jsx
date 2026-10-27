// App.jsx
import { useState } from 'react'
import searchPokemon from './api/pokemonTcgApi'
import './App.css'
import Navbar from "./components/Navbar"

function App() {
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState(null)

  async function handleSearch() {
    try {
      const data = await searchPokemon(searchText)
      console.log('PokéWallet response:', data)
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  return (
    <>
    <Navbar/>
    </>
  )
}

export default App