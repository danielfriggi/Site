import { Link } from "react-router-dom";
import "./Jogos.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import qa from "../../assets/qa.gif";
import imposter from "../../assets/Imposter.gif";
import sueca from "../../assets/sueca.gif";
import cs from "../../assets/coming_soon.gif";
import lol from "../../assets/lol.png";

function Jogos() {
  const jogos = [
    {
      nome: "Perguntas e Respostas (Crisma)",
      img: qa,
      descricao: "Jogo com várias perguntas e respostas de diferentes níveis, teste seu conhecimento!",
      link: "/Jogos/QACrisma",
    },
    {
      nome: "Impostor",
      img: imposter,
      descricao: "Para jogar com os amigos: o impostor clássico, onde todos sabem a palavra menos um. Será que você consegue descobrir quem é?",
      link: "/Jogos/Impostor",
    },
    {
      nome: "Sueca",
      img: sueca,
      descricao: "Divirta-se com os amigos no clássico jogo de sueca, com vários modos diferentes. Apenas para maiores de 18 anos!",
      link: "https://play.google.com/store/apps/details?id=com.danielfriggi.Sueca",
    },
    {
      nome: "Randomizer League of Legends",
      img: lol,
      descricao: "Quer fazer aquela baguncinha jogando Lol? É só clicar aqui",
      link: "/Jogos/RandomizerLeagueOfLegends",
    },
    {
      nome: "Em construção",
      img: cs,
      descricao: "...",
      link: "#",
    },
  ];

  return (
    <div className="jogos">
      <Header />

      <main className="container">
        <h2>Jogos</h2>
        <p className="page-description">
          Aqui você encontra todos os jogos que desenvolvi até o momento.
          Cada card mostra uma prévia animada do jogo, e você pode abri-lo clicando no botão.
        </p>

        <div className="games-grid">
          {jogos.map((jogo, index) => (
            <article className="game-card" key={index}>
              <div className="game-img">
                <img src={jogo.img} alt={`Prévia do jogo ${jogo.nome}`} />
              </div>
              <h3>{jogo.nome}</h3>
              <p>{jogo.descricao}</p>

              {jogo.link !== "#" ? (
                jogo.link.startsWith("http") ? (
                  <a 
                    href={jogo.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label={`Abrir jogo ${jogo.nome} em nova aba`}
                  >
                    <button className="game-btn">Abrir jogo</button>
                  </a>
                ) : (
                  <Link 
                    to={jogo.link} 
                    aria-label={`Abrir jogo ${jogo.nome}`}
                  >
                    <button className="game-btn">Abrir jogo</button>
                  </Link>
                )
              ) : (
                <button className="game-btn" disabled aria-disabled="true">
                  Em breve
                </button>
              )}
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Jogos;
