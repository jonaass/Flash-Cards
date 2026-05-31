// LoadingScreen.jsx
import { TopBar } from "../TopBar/TopBar";
import styles from "./LoadingScreen.module.css";

export function LoadingScreen({ theme, onToggleTheme }) {
  return (
    <div className={styles.page}>
      <TopBar theme={theme} onToggleTheme={onToggleTheme} activeTab="estudar" />
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p className={styles.text}>Analisando texto e criando flashcards…</p>
      </div>
    </div>
  );
}
