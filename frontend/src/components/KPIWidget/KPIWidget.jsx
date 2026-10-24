import styles from "./KPIWidget.module.css";
function KPIWidget({ title, value, percentage, variant = "default" }) {
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      {" "}
      <p>{title}</p> <strong>{value}</strong>{" "}
      {percentage && <span>{percentage}</span>}{" "}
    </article>
  );
}
export default KPIWidget;
