import { useAuth } from "../../hooks/useAuth";
import styles from "./Table.module.css";

function Table({
  columns = [],
  data = [],
  renderRow,
  emptyMessage = "No records found",
}) {
  const { user } = useAuth();
  const compact = Boolean(user?.preferences?.compactTables);
  return (
    <div className={styles.wrapper}>
      <table className={`${styles.table} ${compact ? styles.compact : ""}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(renderRow)
          ) : (
            <tr>
              <td
                colSpan={Math.max(columns.length, 1)}
                className={styles.empty}
              >
                <div className={styles.emptyContent}>
                  <span>▤</span>
                  <strong>{emptyMessage}</strong>
                  <small>There is currently no data to display.</small>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
