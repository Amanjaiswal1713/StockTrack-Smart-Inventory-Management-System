import styles from "./Button.module.css";

function Button({
  children,

  onClick,

  variant = "primary",
}) {
  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
}

export default Button;
