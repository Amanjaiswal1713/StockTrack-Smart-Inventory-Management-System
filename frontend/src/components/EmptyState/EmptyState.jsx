import styles from "./EmptyState.module.css";

function EmptyState({ title }) {
  return (
    <div className={styles.empty}>
      <h2>{title}</h2>
    </div>
  );
}

export default EmptyState;
