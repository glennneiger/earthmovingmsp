import React from "react";
import spinner from "./warehousetransferspinner.gif";

export default () => {
  return (
    <div>
      <img
        src={spinner}
        style={{ width: "auto", margin: "auto", display: "block" }}
        alt="Loading..."
      />
    </div>
  );
};
