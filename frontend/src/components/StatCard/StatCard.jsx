import styles from "./StatCard.module.css";

function StatCard({ title, value }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default StatCard;
