import React from "react";
import loading from "./loadrr.gif";
export default function Spinner() {
  return (
    <div>
      <img src={loading} alt="loading" className="loadingImage " />
    </div>
  );
}
