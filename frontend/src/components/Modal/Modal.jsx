import { useEffect } from "react";

import styles from "./Modal.module.css";

function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={() => onClose?.()}
      role="presentation"
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={() => onClose?.()}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </section>
    </div>
  );
}

export default Modal;
