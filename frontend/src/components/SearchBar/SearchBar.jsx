import styles from "./SearchBar.module.css";

function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      className={styles.search}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default SearchBar;
