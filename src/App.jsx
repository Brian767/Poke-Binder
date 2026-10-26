// App.jsx
import { useState } from 'react'
import searchPokemon from './api/pokemonTcgApi'
import './App.css'

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
    <main>
      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search Pokémon"
      />
      <button onClick={handleSearch}>Search</button>

      {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </main>
  )
}

export default App