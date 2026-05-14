import { useState, useEffect } from "react"
import "./impostor.css"
import { palavras } from "./palavras"
import type { Categoria } from "./palavras"

export default function Impostor() {
  const [players, setPlayers] = useState<string[]>([])
  const [playerName, setPlayerName] = useState("")
  const [categoria, setCategoria] = useState<Categoria | "">("")
  const [gameStarted, setGameStarted] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [commonWord, setCommonWord] = useState("")
  const [impostorIndex, setImpostorIndex] = useState<number | null>(null)

  const [showWord, setShowWord] = useState(false)
  const [timer, setTimer] = useState(0)
  const [showEndGame, setShowEndGame] = useState(false)
  const [revealedImpostor, setRevealedImpostor] = useState<string | null>(null)

  useEffect(() => {
    if (!showEndGame) return

    const interval = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [showEndGame])

  function addPlayer() {
    if (!playerName.trim()) return
    setPlayers(prev => [...prev, playerName.trim()])
    setPlayerName("")
  }

  function getRandomWord(cat: Categoria | "") {
    let words: string[] = []

    if (cat) {
      words = [...palavras[cat]]
    } else {
      words = Object.values(palavras).flat()
    }

    return words[Math.floor(Math.random() * words.length)]
  }

  function startGame() {
    if (players.length < 3) {
      alert("Adicione pelo menos 3 jogadores!")
      return
    }

    const word = getRandomWord(categoria)
    const impostor = Math.floor(Math.random() * players.length)

    setCommonWord(word)
    setImpostorIndex(impostor)
    setCurrentIndex(0)
    setGameStarted(true)
  }

  function nextPlayer() {
    if (currentIndex < players.length - 1) {
      setShowWord(false)
      setCurrentIndex(prev => prev + 1)
    }
  }

  function handleReveal() {
    if (currentIndex === players.length - 1 && showWord) {
      setShowWord(false)
      setShowEndGame(true)
      return
    }

    setShowWord(prev => !prev)
  }

  function revealImpostor() {
    if (impostorIndex !== null) {
      setRevealedImpostor(players[impostorIndex])
    }
  }

function resetGame() {
  const manterNomes = window.confirm("Deseja manter os mesmos nomes dos jogadores?");

  setGameStarted(false);
  setCurrentIndex(0);
  setCommonWord("");
  setImpostorIndex(null);
  setShowWord(false);
  setTimer(0);
  setShowEndGame(false);
  setRevealedImpostor(null);
  setCategoria("");

  if (!manterNomes) {
    setPlayers([]);
  }
}
function prevPlayer() {
  if (currentIndex > 0) {
    setShowWord(false);
    setCurrentIndex(prev => prev - 1);
  }
}

  const categorias = Object.keys(palavras) as Categoria[]

  return (
    <div className="impostor">
      <div className="container">
        <h1>Impostor</h1>

        {!gameStarted && (
          <>
            <h2>Cadastro de Jogadores</h2>

            <div className="input-group">
              <input
                type="text"
                placeholder="Nome do jogador"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
              />
              <button onClick={addPlayer}>Adicionar</button>
            </div>

            <ul id="playerList">
              {players.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>

            <div className="input-group">
              <label>Escolha uma categoria:</label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value as Categoria | "")}
              >
                <option value="">Aleatório</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button className="primary-btn" onClick={startGame}>
              Iniciar jogo
            </button>
          </>
        )}

        {gameStarted && (
          <>
            {!showEndGame && (
              <>
                <h2 id="playerTurn">
                  Vez de: {players[currentIndex]}
                </h2>

                <button onClick={handleReveal}>
                  {showWord
                    ? currentIndex === players.length - 1
                      ? "Começar o jogo"
                      : "Esconder palavra"
                    : "Mostrar palavra"}
                </button>

                {showWord && (
                  <p id="word" style={{ fontWeight: 'bold', fontSize: '1.5rem', margin: '10px 0' }}>
                    {currentIndex === impostorIndex
                      ? "IMPOSTOR"
                      : commonWord}
                  </p>
                )}

                <div className="navigation-btns" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                  {currentIndex > 0 && (
                    <button onClick={prevPlayer} className="primary-btn">
                      Jogador Anterior
                    </button>
                  )}

                  {currentIndex < players.length - 1 && (
                    <button
                      className="primary-btn"
                      onClick={nextPlayer}
                    >
                      Próximo jogador
                    </button>
                  )}
                </div>
              </>
            )}

            {showEndGame && (
              <div id="endGame">
                <p>
                  Tempo: <span id="timeLeft">{timer}</span> s
                </p>

                <button
                  className="primary-btn"
                  onClick={revealImpostor}
                >
                  Revelar Impostor
                </button>

                {revealedImpostor && (
                  <p id="impostorReveal">
                    {revealedImpostor}
                  </p>
                )}
              </div>
            )}

            <button className="reset-btn" onClick={resetGame}>
              Resetar jogo
            </button>
          </>
        )}
      </div>
    </div>
  )
}
