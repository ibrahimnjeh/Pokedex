import Header from "./components/Header"
import PokeCard from "./components/PokeCard"
import SideNav from "./components/SideNav"
import './app.css'
import { useState } from "react"

function App() {
  const [selectedPokemon,setselectedPokemon]=useState(0)

  return (
  <>
  <header/>
  <SideNav selectedPokemon={selectedPokemon} setselectedPokemon={selectedPokemon}/>
  <PokeCard selectedPokemon={selectedPokemon}/>
  </>
  )
}

export default App
