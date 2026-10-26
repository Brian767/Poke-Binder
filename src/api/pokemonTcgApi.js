export default async function searchPokemon(pokemonName) {
  const response = await fetch(
    `/api/search?q=${encodeURIComponent(pokemonName)}`
  )

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const data = await response.json()
  console.log('PokéWallet response:', data)
  return data
}