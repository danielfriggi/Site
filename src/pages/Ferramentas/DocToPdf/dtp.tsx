import { useCallback, useEffect, useRef, useState } from "react";
import "./dtp.css";

/* ---------- Tipos globais das libs carregadas via CDN ---------- */
declare global {
  interface Window {
    JSZip: any;
    mammoth: any;
    jspdf: { jsPDF: any };
  }
}

/* ---------- Carregamento das libs via CDN (uma vez) ---------- */
function loadScript(src: string, globalName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w[globalName]) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error(`Falha ao carregar ${src}`)),
      );
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
    document.head.appendChild(s);
  });
}

/* ---------- Helpers de nome / download ---------- */
function safeName(s: string): string {
  return (
    s
      .replace(/[\\/:*?"<>|\x00-\x1F]/g, "_")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[. ]+$/g, "") || ""
  );
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/* ---------- Sanitização (aspas curvas, travessões, etc.) ---------- */
function sanitizeText(s: string): string {
  return s
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "--")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
}

/* ---------- Extrai texto de um nó DOM preservando <br> ---------- */
function nodeToText(node: Node): string {
  let out = "";
  node.childNodes.forEach((c) => {
    if (c.nodeType === Node.TEXT_NODE) {
      out += c.nodeValue ?? "";
    } else if (c.nodeType === Node.ELEMENT_NODE) {
      const el = c as Element;
      if (el.tagName === "BR") out += "\n";
      else out += nodeToText(el);
    }
  });
  return out;
}

/* ---------- Quebra por palavra + fallback caractere-a-caractere ---------- */
function wrapText(pdf: any, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  const flush = () => {
    if (current) {
      lines.push(current);
      current = "";
    }
  };

  for (const word of text.split(" ")) {
    const test = current ? current + " " + word : word;
    if (pdf.getTextWidth(test) <= maxWidth) {
      current = test;
      continue;
    }
    flush();
    if (pdf.getTextWidth(word) > maxWidth) {
      let chunk = "";
      for (const ch of word) {
        if (pdf.getTextWidth(chunk + ch) <= maxWidth) chunk += ch;
        else {
          lines.push(chunk);
          chunk = ch;
        }
      }
      current = chunk;
    } else {
      current = word;
    }
  }
  flush();
  return lines;
}

/* ---------- Conversão DOCX → Blob PDF ---------- */
async function docxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const result: { value: string } = await window.mammoth.convertToHtml({
    arrayBuffer,
  });

  const doc = new DOMParser().parseFromString(result.value, "text/html");

  const blocks: string[] = [];
  doc.body
    .querySelectorAll("p, li, h1, h2, h3, h4, h5, h6, blockquote, pre")
    .forEach((el) => {
      const t = sanitizeText(nodeToText(el));
      if (t.trim()) blocks.push(t);
    });

  if (!blocks.length) {
    const t = sanitizeText(nodeToText(doc.body));
    if (t.trim()) blocks.push(t);
  }
  if (!blocks.length) throw new Error("Documento sem texto reconhecível.");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const mL = 25,
    mR = 20,
    mT = 20,
    mB = 20;
  const maxWidth = pageW - mL - mR;
  const fontSize = 12;

  pdf.setFont("times", "normal");
  pdf.setFontSize(fontSize);

  const lineHeight = fontSize * 1.5 * 0.3528;
  const paragraphSpacing = lineHeight * 0.6;

  let y = mT;
  const newPageIfNeeded = (extra: number) => {
    if (y + extra > pageH - mB) {
      pdf.addPage();
      pdf.setFont("times", "normal");
      pdf.setFontSize(fontSize);
      y = mT;
    }
  };

  for (const block of blocks) {
    for (const sub of block.split(/\r?\n/)) {
      if (!sub.trim()) {
        newPageIfNeeded(lineHeight);
        y += lineHeight;
        continue;
      }
      const lines = wrapText(pdf, sub, maxWidth);
      for (const line of lines) {
        newPageIfNeeded(lineHeight);
        pdf.text(line, mL, y);
        y += lineHeight;
      }
    }
    newPageIfNeeded(paragraphSpacing);
    y += paragraphSpacing;
  }

  return pdf.output("blob");
}

/* ---------- Componente ---------- */
type BatchResult = {
  name: string;
  blob: Blob;
  count: number;
  errors: number;
};

export default function DocxToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [batchZips, setBatchZips] = useState<BatchResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Aguardando arquivos.");
  const [batchSize, setBatchSize] = useState(50);
  const [drag, setDrag] = useState(false);
  const [libsReady, setLibsReady] = useState(false);
  const [libError, setLibError] = useState<string | null>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
        "JSZip",
      ),
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js",
        "mammoth",
      ),
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
        "jspdf",
      ),
    ])
      .then(() => setLibsReady(true))
      .catch((e: Error) => setLibError(e.message));
  }, []);

  const addFiles = useCallback((list: FileList | File[]) => {
    const incoming = Array.from(list).filter((f) =>
      f.name.toLowerCase().endsWith(".docx"),
    );
    setFiles((prev) => {
      const seen = new Set(
        prev.map((f) => `${f.name}|${f.size}|${f.lastModified}`),
      );
      const next = [...prev];
      for (const f of incoming) {
        const k = `${f.name}|${f.size}|${f.lastModified}`;
        if (!seen.has(k)) {
          next.push(f);
          seen.add(k);
        }
      }
      return next;
    });
  }, []);

  const clear = () => {
    if (busy) return;
    setFiles([]);
    setBatchZips([]);
    setProgress(0);
    setProgressText("Aguardando arquivos.");
  };

  const convert = async () => {
    if (busy || !files.length || !libsReady) return;
    setBusy(true);
    setBatchZips([]);
    setProgress(0);

    const total = files.length;
    let done = 0;
    let success = 0;
    let fail = 0;

    const groups: File[][] = [];
    for (let i = 0; i < files.length; i += batchSize) {
      groups.push(files.slice(i, i + batchSize));
    }

    const newBatches: BatchResult[] = [];

    try {
      for (let bi = 0; bi < groups.length; bi++) {
        const zip = new window.JSZip();
        const used = new Map<string, number>();
        let inBatch = 0;
        let errors = 0;

        for (const file of groups[bi]) {
          setProgressText(`Convertendo ${done + 1} de ${total}: ${file.name}`);
          try {
            const pdf = await docxToPdf(file);
            let base = safeName(file.name.replace(/\.docx$/i, ""));
            const n = (used.get(base) ?? 0) + 1;
            used.set(base, n);
            if (n > 1) base += `_${n}`;
            zip.file(base + ".pdf", pdf);
            success++;
            inBatch++;
          } catch (err: any) {
            fail++;
            errors++;
            zip.file(
              "_ERROS.txt",
              `${file.name}\n${err?.message ?? String(err)}\n\n`,
            );
          }
          done++;
          setProgress(Math.round((done / total) * 100));
        }

        const blob: Blob = await zip.generateAsync({ type: "blob" });
        newBatches.push({
          name: `lote_${String(bi + 1).padStart(2, "0")}.zip`,
          blob,
          count: inBatch,
          errors,
        });
      }

      setBatchZips(newBatches);
      setProgressText(
        `Concluído: ${success} PDF(s) criado(s), ${fail} erro(s), de ${total} arquivo(s).`,
      );
    } catch (err: any) {
      setProgressText(
        "Ocorreu um erro inesperado: " + (err?.message ?? String(err)),
      );
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    if (!batchZips.length) return;
    const all = new window.JSZip();
    batchZips.forEach((z) => all.file(z.name, z.blob));
    const blob: Blob = await all.generateAsync({ type: "blob" });
    saveBlob(blob, "todos_os_lotes_de_poesias.zip");
  };

  return (
    <main className="dtp-wrap">
      <section className="dtp-hero">
        <div className="dtp-eyebrow">Ferramenta local · sem backend</div>
        <h1>DOCX para PDF</h1>
        <p>
          Selecione os arquivos Word, converta cada um em um PDF separado e
          baixe os resultados em ZIPs de até 50 arquivos. O processamento
          acontece no seu navegador.
        </p>
        <div className="dtp-note">
          Importante: esta ferramenta preserva parágrafos e quebras de linha do
          texto, mas pode não reproduzir exatamente fontes, margens ou paginação
          do Word. Confira alguns PDFs antes de enviar para registro.
        </div>
      </section>

      <section className="dtp-panel">
        <div
          className={`dtp-drop${drag ? " dtp-drag" : ""}`}
          tabIndex={0}
          role="button"
          onClick={() => !busy && pickerRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !busy) {
              e.preventDefault();
              pickerRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (!busy) addFiles(e.dataTransfer.files);
          }}
        >
          <strong>Solte aqui seus arquivos .DOCX</strong>
          <small>ou clique para escolher vários arquivos de uma vez</small>
          <input
            ref={pickerRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className="dtp-controls">
          <label>
            Lote por ZIP
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              disabled={busy}
            >
              <option value={50}>50 arquivos</option>
              <option value={25}>25 arquivos</option>
              <option value={100}>100 arquivos</option>
            </select>
          </label>
          <button
            className="dtp-btn"
            onClick={convert}
            disabled={!files.length || busy || !libsReady}
          >
            Converter arquivos
          </button>
          <button
            className="dtp-btn dtp-secondary"
            onClick={clear}
            disabled={!files.length || busy}
          >
            Limpar seleção
          </button>
        </div>

        {libError && (
          <div className="dtp-note dtp-error">
            Falha ao carregar bibliotecas: {libError}
          </div>
        )}
        {!libsReady && !libError && (
          <div className="dtp-muted" style={{ marginTop: 12 }}>
            Carregando bibliotecas…
          </div>
        )}

        <div className="dtp-muted" style={{ marginTop: 12 }}>
          {files.length
            ? `${files.length} arquivo(s) selecionado(s).`
            : "Nenhum arquivo selecionado."}
        </div>

        <div className="dtp-filelist">
          {files.slice(0, 100).map((f, i) => (
            <div className="dtp-file" key={`${f.name}-${i}`}>
              <span>{f.name}</span>
              <span className="dtp-pill">
                {(f.size / 1024).toFixed(0)} KB
              </span>
            </div>
          ))}
          {files.length > 100 && (
            <div className="dtp-muted">
              ... e mais {files.length - 100} arquivo(s).
            </div>
          )}
        </div>
      </section>

      <section className="dtp-panel">
        <h2>Progresso</h2>
        <div className="dtp-muted">{progressText}</div>
        <div className="dtp-status">
          <div className="dtp-bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="dtp-results">
          {batchZips.map((z, i) => (
            <div className="dtp-batch" key={z.name}>
              <h3>Lote {i + 1}</h3>
              <p>
                {z.count} PDF(s) incluído(s)
                {z.errors ? ` · ${z.errors} erro(s)` : ""}
              </p>
              <button
                className="dtp-btn dtp-secondary"
                onClick={() => saveBlob(z.blob, z.name)}
              >
                Baixar ZIP
              </button>
            </div>
          ))}
        </div>

        <div className="dtp-actions">
          <button
            className="dtp-btn"
            onClick={downloadAll}
            disabled={!batchZips.length}
          >
            Baixar todos os ZIPs
          </button>
        </div>
      </section>

      <footer className="dtp-footer">
        Os arquivos são processados localmente no navegador. As bibliotecas
        necessárias são carregadas da internet.
      </footer>
    </main>
  );
}