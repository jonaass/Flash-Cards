// TopBar.jsx — com animação no toggle de tema
import { useState } from "react";
import styles from "./TopBar.module.css";

export function TopBar({
  activeTab = "estudar",
  theme,
  onToggleTheme,
  onTabChange,
}) {
  const [spinning, setSpinning] = useState(false);

  function handleToggle() {
    if (spinning) return;
    setSpinning(true);
    onToggleTheme();
    // Remove a classe de animação após ela terminar
    setTimeout(() => setSpinning(false), 500);
  }

  return (
    <header className={styles.bar}>
      <span className={styles.logo}>Flash-Card</span>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "estudar" ? styles.tabActive : ""}`}
          onClick={() => onTabChange?.("estudar")}
        >
          Estudar
        </button>
        <button
          className={`${styles.tab} ${activeTab === "biblioteca" ? styles.tabActive : ""}`}
          onClick={() => onTabChange?.("biblioteca")}
        >
          Biblioteca
        </button>
      </nav>

      <button
        className={`${styles.themeToggle} ${spinning ? styles.spinning : ""}`}
        onClick={handleToggle}
        title={
          theme === "light" ? "Mudar para modo escuro" : "Mudar para modo claro"
        }
        aria-label="Alternar tema"
      >
        <span className={styles.themeIcon}>
          {theme === "light" ? "🌙" : "☀️"}
        </span>
      </button>
    </header>
  );
}
