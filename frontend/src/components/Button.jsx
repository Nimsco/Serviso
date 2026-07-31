import React from "react";

const Button = ({ text, type = "primary", onClick }) => {
  const baseStyle =
    "px-5 py-2 rounded-lg font-medium tracking-wide text-sm transition-all duration-200 cursor-pointer shadow-xs active:scale-98";

  const styles = {
    primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] border border-[var(--primary)]",
    secondary: "bg-transparent text-[var(--primary)] border border-[var(--primary)] hover:bg-[var(--primary-light)]",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${styles[type]}`}
    >
      {text}
    </button>
  );
};

export default Button;