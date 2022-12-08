import React, { FC } from "react";
import JigsawPuzzle from "./JigsawPuzzle";
import "./App.css";

const App: FC = () => {
  return (
    <div className="appContainer">
      <JigsawPuzzle />
    </div>
  );
};

export default App;
