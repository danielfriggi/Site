import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./chapeu.css";

interface Player {
  name: string;
  words: string[];
}

interface Team {
  name: string;
  players: Player[];
  score: number;
}

export default function Chapeu() {
  // Game Setup States
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRegName, setCurrentRegName] = useState("");
  const [currentRegWords, setCurrentRegWords] = useState<string[]>(["", "", "", "", ""]);
  const [regError, setRegError] = useState("");

  // Game Progress States
  const [gameState, setGameState] = useState<"setup" | "teams" | "round_intro" | "turn_pre" | "turn_active" | "turn_post" | "game_over">("setup");
  
  // Teams
  const [teamA, setTeamA] = useState<Team>({ name: "Equipe A", players: [], score: 0 });
  const [teamB, setTeamB] = useState<Team>({ name: "Equipe B", players: [], score: 0 });
  const [playerQueue, setPlayerQueue] = useState<Player[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  // Rounds
  const [currentRound, setCurrentRound] = useState(1);
  const roundDescriptions = [
    "", // index 0 unused
    "Descrever livremente usando frases. Não vale dizer a palavra nem termos derivados!",
    "Descrever usando apenas uma palavra! Escolha com muito cuidado.",
    "Fazer apenas mímicas! Silêncio total.",
    "Fazer apenas sons! Nenhum gesto ou palavra é permitido."
  ];

  // Word pool
  const [allRegisteredWords, setAllRegisteredWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [guessedWordsThisRound, setGuessedWordsThisRound] = useState<string[]>([]);
  const [skippedThisTurn, setSkippedThisTurn] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string | null>(null);

  // Active Turn States
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [wordsGuessedThisTurn, setWordsGuessedThisTurn] = useState<string[]>([]);

  // Sound effects or visual feedback
  const timerRef = useRef<any>(null);

  // Add player registration
  const handleAddPlayer = () => {
    if (!currentRegName.trim()) {
      setRegError("Por favor, insira o nome do participante.");
      return;
    }
    
    // Filter non-empty words
    const filledWords = currentRegWords
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (filledWords.length === 0) {
      setRegError("Por favor, cadastre pelo menos 1 palavra.");
      return;
    }

    if (players.some(p => p.name.toLowerCase() === currentRegName.trim().toLowerCase())) {
      setRegError("Este nome já foi cadastrado.");
      return;
    }

    const newPlayer: Player = {
      name: currentRegName.trim(),
      words: filledWords
    };

    setPlayers([...players, newPlayer]);
    
    // Reset form for next player
    setCurrentRegName("");
    setCurrentRegWords(["", "", "", "", ""]);
    setRegError("");
  };

  const handleWordChange = (index: number, val: string) => {
    const updated = [...currentRegWords];
    updated[index] = val;
    setCurrentRegWords(updated);
  };

  // Start division of teams
  const handleStartTeams = () => {
    if (players.length < 2) {
      setRegError("Cadastre pelo menos 2 jogadores para iniciar o jogo!");
      return;
    }

    // Combine all words from players
    const allWords: string[] = [];
    players.forEach(p => {
      p.words.forEach(w => {
        if (!allWords.includes(w)) {
          allWords.push(w);
        }
      });
    });

    setAllRegisteredWords(allWords);
    setAvailableWords([...allWords]);

    // Randomly divide players into two teams
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffledPlayers.length / 2);
    const tAPlayers = shuffledPlayers.slice(0, half);
    const tBPlayers = shuffledPlayers.slice(half);

    const tA: Team = { name: "Equipe A", players: tAPlayers, score: 0 };
    const tB: Team = { name: "Equipe B", players: tBPlayers, score: 0 };

    setTeamA(tA);
    setTeamB(tB);

    // Form player queue by alternating
    const queue: Player[] = [];
    const maxLen = Math.max(tAPlayers.length, tBPlayers.length);
    for (let i = 0; i < maxLen; i++) {
      if (tAPlayers[i]) queue.push(tAPlayers[i]);
      if (tBPlayers[i]) queue.push(tBPlayers[i]);
    }

    setPlayerQueue(queue);
    setCurrentQueueIndex(0);
    setGameState("teams");
  };

  // Proceed to round explanation
  const handleGoToRoundIntro = () => {
    setGameState("round_intro");
  };

  // Start turn preparation screen
  const handleGoToTurnPre = () => {
    setGameState("turn_pre");
  };

  // Iniciar Turno (Active Turn Screen)
  const handleStartTurn = () => {
    setTimeLeft(60);
    setWordsGuessedThisTurn([]);
    setSkippedThisTurn([]);
    setGameState("turn_active");
    setTimerActive(true);

    // Get a random word
    if (availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const word = availableWords[randomIndex];
      setCurrentWord(word);
      // Remove it from temporary available pool so it can't be redrawn immediately
      setAvailableWords(availableWords.filter((_, idx) => idx !== randomIndex));
    } else {
      setCurrentWord(null);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleTurnTimeOut();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, timerActive]);

  // Handle when 60 seconds are over
  const handleTurnTimeOut = () => {
    setTimerActive(false);
    setGameState("turn_post");

    // Put current word back to available list since it wasn't guessed
    let updatedAvailable = [...availableWords];
    if (currentWord) {
      updatedAvailable.push(currentWord);
    }
    // Put skipped words back to the end of available list
    updatedAvailable = [...updatedAvailable, ...skippedThisTurn];

    setAvailableWords(updatedAvailable);
    setCurrentWord(null);
    setSkippedThisTurn([]);
  };

  // Helper to find which team a player belongs to
  const getPlayerTeam = (player: Player) => {
    if (teamA.players.some(p => p.name === player.name)) {
      return teamA;
    }
    return teamB;
  };

  // Acertou button
  const handleGuessed = () => {
    if (!currentWord) return;

    const currentPlayer = playerQueue[currentQueueIndex];
    const playerTeam = getPlayerTeam(currentPlayer);

    // Add score
    if (playerTeam.name === "Equipe A") {
      setTeamA(prev => ({ ...prev, score: prev.score + 1 }));
    } else {
      setTeamB(prev => ({ ...prev, score: prev.score + 1 }));
    }

    // Move to guessed list for the round
    setGuessedWordsThisRound(prev => [...prev, currentWord]);
    setWordsGuessedThisTurn(prev => [...prev, currentWord]);

    // Check if there are more words in the pool
    if (availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const nextWord = availableWords[randomIndex];
      setCurrentWord(nextWord);
      setAvailableWords(availableWords.filter((_, idx) => idx !== randomIndex));
    } else {
      // No more words left in available list!
      // Wait, what if there are skipped words in this turn?
      // Remember: skipped words "só deve poder voltar quando passar para o próximo jogador",
      // so we cannot draw skipped words for the same player.
      // Thus, if availableWords is empty, the round is essentially complete!
      // Let's finish the turn or round.
      setTimerActive(false);
      setCurrentWord(null);
      handleEndOfRound();
    }
  };

  // Pular button
  const handleSkip = () => {
    if (!currentWord) return;

    // Put current word into skippedThisTurn list
    const updatedSkipped = [...skippedThisTurn, currentWord];
    setSkippedThisTurn(updatedSkipped);

    // Draw next word
    if (availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const nextWord = availableWords[randomIndex];
      setCurrentWord(nextWord);
      setAvailableWords(availableWords.filter((_, idx) => idx !== randomIndex));
    } else {
      // No more words left to draw
      setCurrentWord(null);
    }
  };

  // End of Round logic
  const handleEndOfRound = () => {
    // If we have completed the current round
    if (currentRound < 4) {
      // Put all guessed words back to available words for the next round
      // and combine with any remaining available words or skipped words
      const nextRoundWords = [...allRegisteredWords];
      setAvailableWords(nextRoundWords);
      setGuessedWordsThisRound([]);
      setSkippedThisTurn([]);
      setCurrentRound(prev => prev + 1);
      
      // Advance player queue index for the next turn
      setCurrentQueueIndex(prev => (prev + 1) % playerQueue.length);
      
      setGameState("round_intro");
    } else {
      // Game Over after round 4
      setGameState("game_over");
    }
  };

  // Passing turn to next player
  const handlePassToNextPlayer = () => {
    // First, check if there are any words left in the entire game (availableWords)
    if (availableWords.length === 0 && skippedThisTurn.length === 0) {
      // If no words are left at all, we proceed to next round
      handleEndOfRound();
    } else {
      // Move to next player in queue
      setCurrentQueueIndex(prev => (prev + 1) % playerQueue.length);
      setGameState("turn_pre");
    }
  };

  // Restart game
  const handleReset = (keepPlayers: boolean) => {
    setGameState("setup");
    setCurrentRound(1);
    setTeamA({ name: "Equipe A", players: [], score: 0 });
    setTeamB({ name: "Equipe B", players: [], score: 0 });
    setPlayerQueue([]);
    setCurrentQueueIndex(0);
    setAllRegisteredWords([]);
    setAvailableWords([]);
    setGuessedWordsThisRound([]);
    setSkippedThisTurn([]);
    setCurrentWord(null);
    setTimeLeft(60);
    setTimerActive(false);
    setWordsGuessedThisTurn([]);
    
    if (!keepPlayers) {
      setPlayers([]);
    } else {
      // If keeping players, reset their words input
      setCurrentRegName("");
      setCurrentRegWords(["", "", "", "", ""]);
      setRegError("");
    }
  };

  return (
    <div className="salada-palavras">

      <main className="container-game">
        <div className="game-card-wrapper">
          {/* SCREEN 1: Setup / Registration */}
          {gameState === "setup" && (
            <div className="setup-screen">
              <h2>Cadastro de Jogadores</h2>
              <p className="subtitle">Cadastre seu nome e até 5 palavras secretas!</p>

              <div className="registration-box">
                <div className="input-group-sp">
                  <label htmlFor="playerName">Nome do Participante:</label>
                  <input
                    id="playerName"
                    type="text"
                    placeholder="Ex: João"
                    value={currentRegName}
                    onChange={e => setCurrentRegName(e.target.value)}
                  />
                </div>

                <div className="words-inputs">
                  <label>Palavras Secretas (mínimo 1):</label>
                  {currentRegWords.map((word, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Palavra ${idx + 1}`}
                      value={word}
                      onChange={e => handleWordChange(idx, e.target.value)}
                    />
                  ))}
                </div>

                {regError && <p className="error-message">{regError}</p>}

                <button className="sp-btn primary-btn" onClick={handleAddPlayer}>
                  Confirmar e Passar Celular
                </button>
              </div>

              {players.length > 0 && (
                <div className="registered-players-list">
                  <h3>Jogadores Cadastrados ({players.length})</h3>
                  <div className="players-badges">
                    {players.map((p, idx) => (
                      <span key={idx} className="player-badge">
                        {p.name} ({p.words.length})
                      </span>
                    ))}
                  </div>

                  <button className="sp-btn start-game-btn" onClick={handleStartTeams}>
                    Iniciar Divisão de Equipes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 2: Team Division */}
          {gameState === "teams" && (
            <div className="teams-screen">
              <h2>Formação das Equipes</h2>
              <p className="subtitle">Os jogadores foram divididos aleatoriamente em duas equipes!</p>

              <div className="teams-container">
                <div className="team-box team-a">
                  <h3>Equipe A</h3>
                  <ul>
                    {teamA.players.map((p, idx) => (
                      <li key={idx}>{p.name}</li>
                    ))}
                  </ul>
                </div>

                <div className="team-box team-b">
                  <h3>Equipe B</h3>
                  <ul>
                    {teamB.players.map((p, idx) => (
                      <li key={idx}>{p.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="queue-preview">
                <h3>Ordem da Fila de Jogadores:</h3>
                <ol>
                  {playerQueue.map((p, idx) => {
                    const team = getPlayerTeam(p);
                    return (
                      <li key={idx} className={team.name === "Equipe A" ? "text-team-a" : "text-team-b"}>
                        {p.name} ({team.name})
                      </li>
                    );
                  })}
                </ol>
              </div>

              <button className="sp-btn primary-btn" onClick={handleGoToRoundIntro}>
                Entendido! Ir para as Rodadas
              </button>
            </div>
          )}

          {/* SCREEN 3: Round Intro */}
          {gameState === "round_intro" && (
            <div className="round-intro-screen">
              <span className="round-badge">Rodada {currentRound} de 4</span>
              <h2>Instruções da Rodada</h2>
              <div className="rule-box">
                <p className="rule-text">{roundDescriptions[currentRound]}</p>
              </div>

              <button className="sp-btn primary-btn" onClick={handleGoToTurnPre}>
                Ir para o Jogo
              </button>
            </div>
          )}

          {/* SCREEN 4: Pre-Turn (Next Player Turn Screen) */}
          {gameState === "turn_pre" && (
            <div className="turn-pre-screen">
              <span className="round-badge">Rodada {currentRound} - Palavras Restantes: {availableWords.length}</span>
              <p className="turn-label">Prepare-se!</p>
              <h2 className="current-player-name">{playerQueue[currentQueueIndex]?.name}</h2>
              <p className={`team-badge ${getPlayerTeam(playerQueue[currentQueueIndex])?.name === "Equipe A" ? "badge-team-a" : "badge-team-b"}`}>
                {getPlayerTeam(playerQueue[currentQueueIndex])?.name}
              </p>

              <div className="ready-instructions">
                <p>Passe o celular para o jogador acima.</p>
                <p>Quando estiver pronto, clique no botão para iniciar seu turno de 60 segundos.</p>
              </div>

              <button className="sp-btn start-turn-btn" onClick={handleStartTurn}>
                Iniciar Turno
              </button>
            </div>
          )}

          {/* SCREEN 5: Active Turn */}
          {gameState === "turn_active" && (
            <div className="turn-active-screen">
              <div className="turn-header">
                <div className="turn-player-info">
                  <h3>Vez de: {playerQueue[currentQueueIndex]?.name}</h3>
                  <span className={getPlayerTeam(playerQueue[currentQueueIndex])?.name === "Equipe A" ? "text-team-a" : "text-team-b"}>
                    {getPlayerTeam(playerQueue[currentQueueIndex])?.name}
                  </span>
                </div>
                <div className={`timer-box ${timeLeft <= 10 ? "timer-danger" : ""}`}>
                  <span>{timeLeft}s</span>
                </div>
              </div>

              <div className="word-display-box">
                {currentWord ? (
                  <h1 className="word-text">{currentWord}</h1>
                ) : (
                  <p className="no-words-text">Sem mais palavras novas neste turno!</p>
                )}
              </div>

              <div className="action-buttons">
                <button className="sp-btn action-btn skip-btn" onClick={handleSkip} disabled={!currentWord}>
                  Pular
                </button>
                <button className="sp-btn action-btn correct-btn" onClick={handleGuessed} disabled={!currentWord}>
                  Acertou!
                </button>
              </div>

              <div className="turn-stats">
                <p>Palavras acertadas nesta rodada: {guessedWordsThisRound.length} / {allRegisteredWords.length}</p>
              </div>
            </div>
          )}

          {/* SCREEN 6: Post-Turn Summary */}
          {gameState === "turn_post" && (
            <div className="turn-post-screen">
              <h2>Fim do Turno!</h2>
              <p className="subtitle">Tempo esgotado para {playerQueue[currentQueueIndex]?.name}.</p>

              <div className="turn-summary-box">
                <h3>Palavras acertadas nesse turno ({wordsGuessedThisTurn.length}):</h3>
                {wordsGuessedThisTurn.length > 0 ? (
                  <ul className="guessed-words-list">
                    {wordsGuessedThisTurn.map((word, idx) => (
                      <li key={idx}>✅ {word}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma palavra acertada. Mais sorte no próximo turno!</p>
                )}
              </div>

              <div className="scoreboard-mini">
                <div className="score-mini-col">
                  <span className="team-a-label">Equipe A</span>
                  <span className="score-num">{teamA.score}</span>
                </div>
                <div className="score-mini-col">
                  <span className="team-b-label">Equipe B</span>
                  <span className="score-num">{teamB.score}</span>
                </div>
              </div>

              <button className="sp-btn primary-btn" onClick={handlePassToNextPlayer}>
                Passar para o próximo jogador
              </button>
            </div>
          )}

          {/* SCREEN 7: Game Over / Final Scores */}
          {gameState === "game_over" && (
            <div className="game-over-screen">
              <span className="victory-crown">👑</span>
              <h2>Fim da Partida!</h2>
              <p className="subtitle font-bold text-xl">E a equipe vencedora é...</p>

              <div className="winner-announcement">
                {teamA.score > teamB.score ? (
                  <h1 className="winner-team text-team-a">🎉 Equipe A 🎉</h1>
                ) : teamB.score > teamA.score ? (
                  <h1 className="winner-team text-team-b">🎉 Equipe B 🎉</h1>
                ) : (
                  <h1 className="winner-team">🤝 Empate! 🤝</h1>
                )}
              </div>

              <div className="final-scoreboard">
                <div className="final-score-row team-a-row">
                  <span className="team-name">Equipe A</span>
                  <span className="team-score">{teamA.score} pts</span>
                </div>
                <div className="final-score-row team-b-row">
                  <span className="team-name">Equipe B</span>
                  <span className="team-score">{teamB.score} pts</span>
                </div>
              </div>

              <div className="game-over-actions">
                <button className="sp-btn secondary-btn" onClick={() => handleReset(true)}>
                  Jogar Novamente (Mesmos Jogadores)
                </button>
                <button className="sp-btn primary-btn" onClick={() => handleReset(false)}>
                  Novo Jogo (Novos Jogadores)
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="back-link-wrapper">
          <Link to="/Jogos" className="back-link">
            ← Voltar para Jogos
          </Link>
        </div>
      </main>

    </div>
  );
}
