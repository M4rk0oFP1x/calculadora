import React, { useMemo, useState } from "react";

const KEYS = [
  ["C", "⌫", "÷", "×"],
  ["7", "8", "9", "−"],
  ["4", "5", "6", "+"],
  ["1", "2", "3", "="],
  ["0", ".", "%"],
];

const OPS = ["+", "−", "×", "÷"];
const isOp = (k) => OPS.includes(k);

function previewCalc(display) {
  if (!display) return "";
  if (OPS.includes(display.at(-1))) return "";
  try {
    const expr = display.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("−", "-");
    const res = eval(expr);
    if (res === Infinity || Number.isNaN(res)) return "";
    return String(res);
  } catch {
    return "";
  }
}

export default function App() {
  const [display, setDisplay] = useState("");
  const [status, setStatus] = useState("");

  const preview = useMemo(() => previewCalc(display), [display]);

  function press(k) {
    setStatus("");

    if (k === "C") return setDisplay("");
    if (k === "⌫") return setDisplay((p) => p.slice(0, -1));

    if (k === "%") {
      const v = previewCalc(display);
      if (!v) return;
      const n = Number(v);
      if (Number.isNaN(n)) return;
      setDisplay(String(n / 100));
      return;
    }

    if (k === "=") {
      const v = previewCalc(display);
      if (!v) return setStatus("Expressão incompleta");
      setDisplay(v);
      return;
    }

    if (isOp(k)) {
      setDisplay((p) => {
        if (!p) return p;
        const last = p.at(-1);
        if (isOp(last)) return p.slice(0, -1) + k;
        return p + k;
      });
      return;
    }

    if (k === ".") {
      setDisplay((p) => {
        const normalized = p.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("−", "-");
        const lastChunk = normalized.split(/[+\-*/]/).pop() ?? "";
        if (lastChunk.includes(".")) return p;
        if (!p || lastChunk === "" || lastChunk === "-") return p + "0.";
        return p + ".";
      });
      return;
    }

    setDisplay((p) => p + k);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Calculadora (Protótipo em React)</div>

        <div style={styles.screen}>
          <div style={styles.display}>{display || "0"}</div>
          <div style={styles.preview}>
            {status ? status : (preview ? `≈ ${preview}` : " ")}
          </div>
        </div>

        <div style={styles.grid}>
          {KEYS.flat().map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              style={{
                ...styles.btn,
                ...(k === "0" ? styles.zero : null),
                ...(k === "=" ? styles.eq : null),
                ...(isOp(k) || ["C", "⌫", "%"].includes(k) ? styles.op : null),
              }}
            >
              {k}
            </button>
          ))}
        </div>

        <div style={styles.todo}>
          <b>TODO:</b> remover <code>eval</code>, parser com precedência, parênteses, histórico, validações melhores.
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0c1220",
    fontFamily: "Arial, sans-serif",
    padding: 16,
  },
  card: {
    width: 380,
    background: "#121a2d",
    borderRadius: 16,
    padding: 16,
    border: "1px solid #1e2a44",
  },
  title: { color: "#e9eefb", fontWeight: 800, fontSize: 18, marginBottom: 12 },
  screen: {
    background: "#0b1020",
    border: "1px solid #233152",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  display: { color: "#e9eefb", fontSize: 26, fontWeight: 700, textAlign: "right" },
  preview: { color: "#93a4c7", fontSize: 12, textAlign: "right", minHeight: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  btn: {
    height: 52,
    borderRadius: 12,
    border: "1px solid #233152",
    background: "#151f33",
    color: "#e9eefb",
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
  },
  op: { background: "#1a2a48" },
  eq: { background: "#243b6b" },
  zero: { gridColumn: "1 / 3" },
  todo: { color: "#93a4c7", fontSize: 12, marginTop: 12, lineHeight: "16px" },
};
