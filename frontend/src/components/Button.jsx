import React from "react";

const Button = ({ text, type = "primary", onClick }) => {
  const baseStyle =
    "px-5 py-2 rounded-md font-medium transition duration-200";

  const styles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50",
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