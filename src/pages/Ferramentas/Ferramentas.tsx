import { Link } from "react-router-dom";
import "./Ferramentas.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Ferramentas() {
  return (
    <div className="ferramentas">
      <Header />

      <main className="container">
        <h2>Ferramentas</h2>
        <p className="page-description">
          Aqui você encontra a exibição de todas as ferramentas desenvolvidas até o momento,
          pensadas para facilitar seu fluxo de trabalho, organizar dados e otimizar processos.
          Em cada ferramenta, você encontra uma breve descrição do seu funcionamento.
        </p>

        <div className="tools-grid">
          <article className="tool-card">
            <h3>Organizador de APIs</h3>
            <p>
              Essa ferramenta permite importar arquivos JSON de APIs, visualizar detalhes
              de cada endpoint, identificar duplicados, agrupar por domínio ou método
              e exportar resultados em CSV.
            </p>
            <Link 
              to="/Ferramentas/ApiSort" 
              aria-label="Abrir ferramenta Organizador de APIs"
            >
              <button className="tool-btn">Abrir ferramenta</button>
            </Link>
          </article>
          <article className="tool-card">
            <h3>Doc to Pdf</h3>
            <p>
              Essa ferramenta permite importar converter arquivos docx para pdf direto do navegador, em batch.
            </p>
            <Link 
              to="/Ferramentas/DocToPdf" 
              aria-label="Abrir ferramenta Organizador de APIs"
            >
              <button className="tool-btn">Abrir ferramenta</button>
            </Link>
          </article>

          <article className="tool-card">
            <h3>Em construção</h3>
            <p>...</p>
            <button className="tool-btn" disabled aria-disabled="true">
              Em breve
            </button>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Ferramentas;
