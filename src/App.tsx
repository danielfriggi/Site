import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import QaCrisma from "./pages/Jogos/QACrisma/QaCrisma"
import Impostor from "./pages/Jogos/Impostor/Impostor"
import ApiSort from "./pages/Ferramentas/ApiSort/ApiSort"
import RandomizerLeagueOfLegends from "./pages/Jogos/RandomizadorLeagueOfLegends/RandomizerLeagueOfLegends"
import Ferramentas from "./pages/Ferramentas/Ferramentas"
import Contato from "./pages/Contato"
import Jogos from "./pages/Jogos/Jogos"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Jogos/QACrisma" element={<QaCrisma/>} />
        <Route path="/Jogos/Impostor" element={<Impostor/>} />
        <Route path="/Jogos/RandomizerLeagueOfLegends" element={<RandomizerLeagueOfLegends/>} />
        <Route path="/Ferramentas/ApiSort" element={<ApiSort/>} />
        <Route path="/Ferramentas" element={<Ferramentas/>} />
        <Route path="/Jogos" element={<Jogos/>} />
        <Route path="/Contato" element={<Contato/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
