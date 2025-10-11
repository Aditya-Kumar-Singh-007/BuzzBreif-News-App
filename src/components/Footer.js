import React from "react";

const Footer = ({ mode }) => {
  return (
    <footer
      style={{
        backgroundColor: mode === "dark" ? "#222" : "#f8f9fa",
        color: mode === "dark" ? "white" : "black",
        textAlign: "center",
        padding: "15px 0",
        marginTop: "40px",
        borderTop: mode === "dark"
          ? "1px solid #444"
          : "1px solid #ddd",
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} <strong>BuzzBreif</strong> — Made by Aditya Kumar Singh
      </p>
    </footer>
  );
};

export default Footer;
